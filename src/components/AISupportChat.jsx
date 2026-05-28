import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSafeApiUrl } from '../utils/media';

const quickReplies = [
  'Find tyres by vehicle',
  'Track my order',
  'Shipping info',
  'Contact support',
  'Check stock'
];

export default function AISupportChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi, I am the BoxBox AI support assistant. I can help with tyres, stock, shipping, tracking, and support questions. What do you need?'
    }
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(null);

  // Generate unique session ID on mount
  useEffect(() => {
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }, []);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, open, typing]);

  const suggestions = useMemo(() => quickReplies, []);

  const sendMessage = async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);

    try {
      // getSafeApiUrl() returns the /api base (e.g. https://boxboxindia.onrender.com/api)
      // so we append /chat, not /api/chat.
      const response = await fetch(`${getSafeApiUrl()}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.message) {
        setMessages(prev => [...prev, { role: 'bot', text: data.message }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: 'Sorry, I encountered an issue processing your request. Please try again.' 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Sorry, I could not connect to the support service. Please try again later or use the WhatsApp button for immediate support.' 
      }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="ai-chat-widget">
      {open && (
        <div className="ai-chat-panel glass-panel">
          <div className="ai-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ai-chat-avatar"><Sparkles size={16} /></div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '900', margin: 0 }}>BoxBox AI Support</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Tyres, orders, shipping</p>
              </div>
            </div>
            <button className="ai-chat-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`ai-chat-bubble ai-chat-bubble-${message.role}`}>
                {message.text}
              </div>
            ))}
            {typing && <div className="ai-chat-bubble ai-chat-bubble-bot">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-quick-replies">
            {suggestions.map(reply => (
              reply === 'Track my order' ? (
                <Link key={reply} to="/track-order" onClick={() => setOpen(false)}>{reply}</Link>
              ) : (
                <button key={reply} onClick={() => sendMessage(reply)}>{reply}</button>
              )
            ))}
          </div>

          <form
            className="ai-chat-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about tyres, stock, shipping..."
            />
            <button type="submit" aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}

      <button className="ai-chat-launcher" onClick={() => setOpen(true)} aria-label="Open AI support chat">
        <Bot size={24} />
      </button>
    </div>
  );
}
