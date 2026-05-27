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
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    // Get or initialize conversation history for this session
    let history = conversationHistory.get(sessionId) || [];

    // Define tools for Gemini
    const tools = [
      {
        name: 'searchProducts',
        description: 'Search for tyres and motorcycle products by name, brand, or vehicle type',
        inputSchema: {
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
        inputSchema: {
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
        inputSchema: {
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
        inputSchema: {
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
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'getHelpArticle',
        description: 'Get information from help articles (refund policy, tyre size guide, etc.)',
        inputSchema: {
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
        inputSchema: {
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

    // Add user message to history
    history.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Send message to Gemini
    let fullResponse = '';
    let toolCalls = [];
    let finalResponse = null;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);

    // Handle tool use and function calling
    let continueLoop = true;
    while (continueLoop) {
      const responseText = result.response.text();
      const candidates = result.response.candidates || [];
      
      if (!candidates.length || candidates[0].finishReason === 'STOP') {
        fullResponse = responseText;
        continueLoop = false;
        break;
      }

      // Check for function calls in the response
      let hasFunctionCall = false;
      for (const candidate of candidates) {
        const content = candidate.content?.parts || [];
        for (const part of content) {
          if (part.functionCall) {
            hasFunctionCall = true;
            const toolName = part.functionCall.name;
            const toolInput = part.functionCall.args;

            console.log(`📞 Function call: ${toolName}`);

            // Process the tool call
            const toolResult = await processTool(toolName, toolInput);
            
            // Add to history and continue conversation
            history.push({
              role: 'model',
              parts: [{ functionCall: { name: toolName, args: toolInput } }]
            });

            history.push({
              role: 'user',
              parts: [{ functionResponse: { name: toolName, response: toolResult } }]
            });

            // Continue chat with tool results
            try {
              const nextResult = await chat.sendMessage([{
                functionResponse: { name: toolName, response: toolResult }
              }]);
              
              fullResponse = nextResult.response.text();
              
              // Check if this is the final response
              if (nextResult.response.candidates?.[0]?.finishReason === 'STOP') {
                continueLoop = false;
              }
            } catch (error) {
              console.error('Error continuing chat after tool call:', error);
              continueLoop = false;
            }
          }
        }
      }

      if (!hasFunctionCall) {
        fullResponse = responseText;
        continueLoop = false;
      }
    }

    // Add bot response to history
    if (fullResponse) {
      history.push({
        role: 'model',
        parts: [{ text: fullResponse }]
      });
    }

    // Store updated history
    conversationHistory.set(sessionId, history);

    return res.json({
      success: true,
      message: fullResponse || 'I encountered an issue processing your request. Please try again.',
      sessionId
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat message'
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
