import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// In dev, Vite proxies /socket.io to the backend, so connect to current origin
// In prod, the server serves both API and socket.io from the same origin
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') 
  : window.location.origin;

// Countdown hook
const useCountdown = (expiresAt) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [urgency, setUrgency] = useState('normal'); // normal, warning, critical

  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        setUrgency('critical');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      setIsExpired(false);

      if (hours < 1) setUrgency('critical');
      else if (hours < 6) setUrgency('warning');
      else setUrgency('normal');
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return { timeLeft, isExpired, urgency };
};

// Countdown badge component
const CountdownBadge = ({ expiresAt, compact = false }) => {
  const { timeLeft, isExpired, urgency } = useCountdown(expiresAt);

  const colors = {
    normal: { bg: 'rgba(34, 211, 238, 0.1)', border: 'rgba(34, 211, 238, 0.25)', text: '#22D3EE' },
    warning: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.25)', text: '#FBBF24' },
    critical: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', text: '#EF4444' },
  };

  const c = colors[urgency];

  if (compact) {
    return (
      <span style={{
        fontSize: '10px', fontWeight: '600', color: c.text,
        background: c.bg, border: `1px solid ${c.border}`,
        padding: '2px 8px', borderRadius: '99px',
        display: 'inline-flex', alignItems: 'center', gap: '4px',
      }}>
        <Clock style={{ width: '10px', height: '10px' }} />
        {isExpired ? 'Expired' : timeLeft}
      </span>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 14px', borderRadius: '12px',
      background: c.bg, border: `1px solid ${c.border}`,
    }}>
      <Clock style={{ width: '14px', height: '14px', color: c.text }} />
      <span style={{ fontSize: '13px', fontWeight: '600', color: c.text }}>
        {isExpired ? 'Chat Expired' : `Expires in ${timeLeft}`}
      </span>
    </div>
  );
};

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatExpired, setChatExpired] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Select a chat and load its messages
  const selectChat = useCallback(async (chat) => {
    setActiveChat(chat);
    setChatExpired(false);
    if (socketRef.current) {
      socketRef.current.emit('join_chat', chat._id);
    }
    try {
      const res = await axios.get(`${API_URL}/chat/${chat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.message?.includes('expired')) {
        setChatExpired(true);
        setMessages([]);
      } else {
        console.error('Error loading chat messages:', err);
        setMessages([]);
      }
    }
  }, [user]);

  // Initialize Socket and fetch chats
  useEffect(() => {
    if (!user) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true
    });
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // Fetch user's chats (server already filters expired)
    axios.get(`${API_URL}/chat`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => {
        setChats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching chats:', err);
        setLoading(false);
      });

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [user]);

  // Auto-select first chat once chats are loaded
  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      selectChat(chats[0]);
    }
  }, [chats, activeChat, selectChat]);

  // Handle incoming messages
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !activeChat) return;

    const handleReceiveMessage = (message) => {
      if (message.chatId === activeChat._id) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [activeChat]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !activeChat || chatExpired) return;

    // Check if chat has expired before sending
    if (activeChat.expiresAt && new Date() > new Date(activeChat.expiresAt)) {
      setChatExpired(true);
      return;
    }

    socketRef.current.emit('send_message', {
      chatId: activeChat._id,
      senderId: user._id,
      content: newMessage.trim()
    });
    setNewMessage('');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="shimmer-effect" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#22D3EE' }} />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '560px', margin: '80px auto', textAlign: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.15))',
          border: '1px solid rgba(6,182,212,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <MessageSquare style={{ width: '36px', height: '36px', color: '#22D3EE' }} />
        </div>
        <h2 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '12px' }}>
          No Active Chats
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
          Unlock premium chats by visiting the Community page and paying ₹20 to chat with any trip creator for 24 hours!
        </p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/community')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '14px', fontSize: '14px', fontWeight: '600',
            background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
            color: 'white', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)',
          }}>
          <Sparkles style={{ width: '16px', height: '16px' }} /> Browse Community Trips
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 140px)', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.1)' }}>
      {/* Sidebar */}
      <div style={{ width: '320px', borderRight: '1px solid rgba(148,163,184,0.1)', background: 'rgba(10, 14, 28, 0.6)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
          <h2 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare style={{ width: '20px', height: '20px', color: '#22D3EE' }} /> Messages
          </h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {chats.map(chat => {
            const otherUser = chat.participants?.find(p => p._id !== user._id);
            const isActive = activeChat?._id === chat._id;
            return (
              <div key={chat._id} onClick={() => selectChat(chat)} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px',
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: '4px',
                background: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(34, 211, 238, 0.2)' : 'transparent'}`
              }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                  {otherUser?.firstName?.charAt(0) || '?'}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {otherUser?.firstName || 'User'} {otherUser?.lastName || ''}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: '3px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.tripId?.title || 'Unknown Trip'}
                  </p>
                  <CountdownBadge expiresAt={chat.expiresAt} compact />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(5, 8, 22, 0.4)' }}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px' }}>
                  {activeChat.participants?.find(p => p._id !== user._id)?.firstName?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                    {activeChat.participants?.find(p => p._id !== user._id)?.firstName} {activeChat.participants?.find(p => p._id !== user._id)?.lastName}
                  </h3>
                  <span style={{ color: '#22D3EE', fontSize: '12px' }}>Premium Traveler Chat</span>
                </div>
              </div>
              <CountdownBadge expiresAt={activeChat.expiresAt} />
            </div>

            {/* Expired Overlay */}
            {chatExpired && (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '40px', textAlign: 'center'
              }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                  <AlertTriangle style={{ width: '32px', height: '32px', color: '#EF4444' }} />
                </div>
                <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
                  Chat Expired
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', maxWidth: '360px' }}>
                  Your 24-hour chat window has ended. You can pay ₹20 again from the Community page to reopen this conversation.
                </p>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/community')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '600',
                    background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                    color: 'white', border: 'none', cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)',
                  }}>
                  <Sparkles style={{ width: '14px', height: '14px' }} /> Renew Access
                </motion.button>
              </div>
            )}

            {/* Messages Area */}
            {!chatExpired && (
              <>
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                      <p style={{ fontSize: '14px' }}>No messages yet. Say hello! 👋</p>
                    </div>
                  )}
                  {messages.map((msg, index) => {
                    const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
                    const isMe = senderId === user._id;
                    return (
                      <motion.div key={msg._id || index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          background: isMe ? 'linear-gradient(135deg, #06B6D4, #3B82F6)' : 'rgba(30, 41, 59, 0.8)',
                          color: 'white',
                          padding: '12px 18px',
                          borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          fontSize: '14.5px',
                          lineHeight: 1.5,
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: isMe ? 'none' : '1px solid rgba(148,163,184,0.1)'
                        }}>
                        {msg.content}
                        <div style={{ fontSize: '10px', color: isMe ? 'rgba(255,255,255,0.7)' : '#64748b', marginTop: '4px', textAlign: 'right' }}>
                          {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div style={{ padding: '20px', borderTop: '1px solid rgba(148,163,184,0.1)', background: 'rgba(10, 14, 28, 0.6)' }}>
                  <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="input-field"
                      style={{ flex: 1, padding: '16px 20px', borderRadius: '99px', background: 'rgba(30, 41, 59, 0.5)' }}
                    />
                    <button type="submit" disabled={!newMessage.trim()} style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                      border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                      opacity: newMessage.trim() ? 1 : 0.5,
                      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                    }}>
                      <Send style={{ width: '20px', height: '20px', marginLeft: '-2px' }} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(30, 41, 59, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <MessageSquare style={{ width: '32px', height: '32px', color: '#475569' }} />
            </div>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Your Premium Chats</h3>
            <p style={{ fontSize: '14px' }}>Select a chat from the sidebar to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
