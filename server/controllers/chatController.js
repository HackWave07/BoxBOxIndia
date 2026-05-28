const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Conversation history per session (simple in-memory store for now) ────────
// In production, consider using Redis or database for persistence
const conversationHistory = new Map();

// ─── Helper Functions for Tool Calls ────────────────────────────────────────

/**
 * Search products by query and optional vehicle type
 */
const searchProducts = async (query, vehicleType = null) => {
  try {
    let filter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ]
    };

    if (vehicleType) {
      filter.vehicleType = { $regex: vehicleType, $options: 'i' };
    }

    const products = await Product.find(filter).limit(5).select('name brand price stock vehicleType');
    return products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      brand: p.brand,
      price: p.price,
      stock: p.stock,
      vehicleType: p.vehicleType,
      inStock: p.stock > 0
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

/**
 * Get product by ID with full details
 */
const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return null;
    return {
      id: product._id.toString(),
      name: product.name,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      description: product.description,
      vehicleType: product.vehicleType,
      size: product.size,
      inStock: product.stock > 0,
      specifications: product.specifications || {}
    };
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
};

/**
 * Get stock status for a product
 */
const getStock = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return { available: false, stock: 0 };
    return {
      productId: product._id.toString(),
      productName: product.name,
      stock: product.stock,
      available: product.stock > 0
    };
  } catch (error) {
    console.error('Error getting stock:', error);
    return { available: false, stock: 0 };
  }
};

/**
 * Track order by order ID
 */
const trackOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId).select('orderNumber status createdAt items totalPrice shippingAddress');
    if (!order) return null;
    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      itemCount: order.items.length,
      totalPrice: order.totalPrice,
      deliveryAddress: order.shippingAddress?.addressLine1 || 'N/A'
    };
  } catch (error) {
    console.error('Error tracking order:', error);
    return null;
  }
};

/**
 * Get shipping information
 */
const getShippingInfo = () => {
  return {
    serviceAreas: 'BoxBox India ships across serviceable Indian pin codes',
    processingTime: 'Orders are prepared after payment confirmation',
    trackingInfo: 'Tracking details are added once the order is shipped via courier',
    supportContact: 'Contact BoxBox support via WhatsApp for tracking updates',
    freeShipping: 'Check specific product pages for shipping offers'
  };
};

/**
 * Get help article/information
 */
const getHelpArticle = (slug) => {
  const helpArticles = {
    'refund-policy': 'Returns and refunds depend on product condition and timelines. Please review the dedicated Refund Policy page or contact support with your order details.',
    'tyre-size-guide': 'For tyre guidance, start with your vehicle type, brand, model, year, and current tyre size. The tyre finder and filters on BoxBox can help narrow compatible options.',
    'order-tracking': 'You can track an order using your order ID or registered phone number on the Track Order page.',
    'contact-support': 'For direct support, use the WhatsApp button on the site or share your vehicle, product, and order details.'
  };
  return helpArticles[slug] || null;
};

/**
 * Contact support (returns contact info)
 */
const contactSupport = () => {
  return {
    whatsapp: 'Available via WhatsApp button on the website',
    email: 'Support team will respond to your inquiry',
    hours: 'Support available during business hours',
    trackOrderLink: 'Use Track Order page for order status updates'
  };
};

// ─── Process Tool Call ────────────────────────────────────────────────────────
const processTool = async (toolName, toolInput) => {
  console.log(`🔧 Processing tool: ${toolName}`, toolInput);
  
  try {
    switch (toolName) {
      case 'searchProducts':
        return await searchProducts(toolInput.query, toolInput.vehicleType);
      
      case 'getProductById':
        return await getProductById(toolInput.productId);
      
      case 'getStock':
        return await getStock(toolInput.productId);
      
      case 'trackOrder':
        return await trackOrder(toolInput.orderId);
      
      case 'getShippingInfo':
        return getShippingInfo();
      
      case 'getHelpArticle':
        return getHelpArticle(toolInput.slug);
      
      case 'contactSupport':
        return contactSupport();
      
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    console.error(`Error processing tool ${toolName}:`, error);
    return { error: error.message };
  }
};

// ─── Main Chat Endpoint Controller ────────────────────────────────────────────

exports.chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment');
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    // Get or initialize conversation history for this session
    let history = conversationHistory.get(sessionId) || [];

    // Define tools for Gemini — must use `parameters`, not `inputSchema`
    const tools = [
      {
        name: 'searchProducts',
        description: 'Search for tyres and motorcycle products by name, brand, or vehicle type',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (e.g., "Michelin touring tyres" or "KTM Duke tyres")'
            },
            vehicleType: {
              type: 'string',
              description: 'Optional vehicle type filter (e.g., "motorcycle", "scooter")'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'getProductById',
        description: 'Get detailed information about a specific product by ID',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: 'The MongoDB ID of the product'
            }
          },
          required: ['productId']
        }
      },
      {
        name: 'getStock',
        description: 'Check stock availability for a product',
        parameters: {
          type: 'object',
          properties: {
            productId: {
              type: 'string',
              description: 'The MongoDB ID of the product'
            }
          },
          required: ['productId']
        }
      },
      {
        name: 'trackOrder',
        description: 'Track an order status by order ID',
        parameters: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'The order ID to track'
            }
          },
          required: ['orderId']
        }
      },
      {
        name: 'getShippingInfo',
        description: 'Get information about shipping, delivery, and service areas',
        parameters: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'getHelpArticle',
        description: 'Get information from help articles (refund policy, tyre size guide, etc.)',
        parameters: {
          type: 'object',
          properties: {
            slug: {
              type: 'string',
              description: 'Article slug (e.g., "refund-policy", "tyre-size-guide", "order-tracking")'
            }
          },
          required: ['slug']
        }
      },
      {
        name: 'contactSupport',
        description: 'Get contact information for BoxBox support',
        parameters: {
          type: 'object',
          properties: {}
        }
      }
    ];

    // Initialize model with tools
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [{ functionDeclarations: tools }],
      systemInstruction: `You are BoxBox India's premium AI support assistant for motorcycles, scooters, and tyres.
Your role is to:
- Help users find the right tyres for their vehicles with expert guidance
- Check stock availability and provide product information
- Assist with order tracking and shipping information
- Provide professional support for returns and refunds
- Keep responses concise, friendly, and professional
- Focus exclusively on BoxBox products and services
- If asked about unrelated topics, politely redirect to BoxBox services
- Always verify information with actual data before claiming something is in stock or available
- If backend data is unavailable, be honest and suggest contacting WhatsApp support`
    });

    // Start chat with existing prior history only (not the current user message).
    // sendMessage() below adds the current user turn — passing it in history too
    // would duplicate it and cause Gemini to reject the request.
    const chat = model.startChat({ history: [...history] });

    // Send the current user message
    const result = await chat.sendMessage(message);

    let fullResponse = '';

    // Check if Gemini wants to call a function.
    // Calling result.response.text() when the response contains a function call
    // (instead of text) throws a GoogleGenerativeAIResponseError, so we must
    // check for function calls first.
    const functionCalls = typeof result.response.functionCalls === 'function'
      ? result.response.functionCalls()
      : [];

    if (functionCalls && functionCalls.length > 0) {
      // Process each function call and collect responses
      const functionResponses = [];
      for (const fc of functionCalls) {
        console.log(`📞 Function call: ${fc.name}`);
        const toolResult = await processTool(fc.name, fc.args);
        functionResponses.push({
          functionResponse: { name: fc.name, response: toolResult }
        });
      }

      // Send all tool results back to Gemini to get the final text response
      const nextResult = await chat.sendMessage(functionResponses);
      fullResponse = nextResult.response.text();
    } else {
      fullResponse = result.response.text();
    }

    // Append this exchange to history for future turns
    history.push({ role: 'user',  parts: [{ text: message }] });
    if (fullResponse) {
      history.push({ role: 'model', parts: [{ text: fullResponse }] });
    }

    // Cap history at 20 entries to prevent unbounded memory growth
    conversationHistory.set(sessionId, history.slice(-20));

    return res.json({
      success: true,
      message: fullResponse || 'I encountered an issue processing your request. Please try again.',
      sessionId
    });

  } catch (error) {
    const msg = error.message || String(error);
    console.error('❌ Chat error:', msg);

    // Detect the most common root causes so the console gives an actionable hint
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('400')) {
      console.error('💡 Fix: The GEMINI_API_KEY in server/.env is not valid.');
      console.error('   Get a free key at https://aistudio.google.com/apikey and paste it into server/.env');
    } else if (msg.includes('GEMINI_API_KEY not configured')) {
      console.error('💡 Fix: Add GEMINI_API_KEY=<your-key> to server/.env');
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
};

/**
 * Clear conversation history for a session (optional endpoint)
 */
exports.clearHistory = (req, res) => {
  try {
    const { sessionId } = req.body;
    conversationHistory.delete(sessionId);
    return res.json({ success: true, message: 'Conversation history cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
