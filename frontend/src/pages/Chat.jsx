import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import Sidebar from '../components/chat/Sidebar';
import Messages from '../components/chat/Messages';
import InputBar from '../components/chat/InputBar';

export default function Chat() {
  const apiBase = '/api';
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.body.classList.add('chat-page');
    loadSessions();
    checkApi();
    const interval = setInterval(checkApi, 30000);
    return () => {
      document.body.classList.remove('chat-page');
      clearInterval(interval);
    };
  }, []);

  const checkApi = async () => {
    try {
      const res = await fetch(`${apiBase}/health`, { signal: AbortSignal.timeout(3000) });
      const data = await res.json();
      setApiStatus(data.status === 'ok' ? 'online' : 'degraded');
    } catch {
      setApiStatus('offline');
    }
  };

  const loadSessions = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('devdocs_sessions') || '[]');
      setSessions(saved);
    } catch {
      setSessions([]);
    }
  };

  const saveSession = (newMessages, idToUse) => {
    if (newMessages.length === 0) return;
    const id = idToUse || Date.now().toString();
    const title = newMessages[0].content.slice(0, 40) + '…';
    const session = { id, title, messages: newMessages, ts: Date.now() };
    
    setSessions(prev => {
      let updated = [...prev];
      const idx = updated.findIndex(s => s.id === id);
      if (idx >= 0) updated[idx] = session;
      else updated.unshift(session);
      updated = updated.slice(0, 30);
      localStorage.setItem('devdocs_sessions', JSON.stringify(updated));
      return updated;
    });
    setCurrentSessionId(id);
  };

  const loadSession = (id) => {
    const s = sessions.find(s => s.id === id);
    if (s) {
      setMessages(s.messages);
      setCurrentSessionId(id);
    }
  };

  const deleteSession = (id) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('devdocs_sessions', JSON.stringify(updated));
      return updated;
    });
    if (currentSessionId === id) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  const newChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const q = inputText.trim();
    if (!q || isLoading) return;
    
    setInputText('');
    setIsLoading(true);

    const userMsg = { id: crypto.randomUUID(), role: 'user', content: q, html: marked.parse(q) };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const res = await fetch(`${apiBase}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      
      const asstMsg = { 
        id: crypto.randomUUID(), 
        role: 'assistant', 
        content: data.answer, 
        html: marked.parse(data.answer),
        sources: data.sources,
        latency: data.latency_ms 
      };
      
      const finalMessages = [...updatedMessages, asstMsg];
      setMessages(finalMessages);
      saveSession(finalMessages, currentSessionId);
    } catch (e) {
      const errorMsg = { id: crypto.randomUUID(), role: 'assistant', content: `Error: ${e.message}`, html: `<p>Error: ${e.message}</p>` };
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedSessions = { Today: [], Yesterday: [], Older: [] };
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  sessions.forEach(s => {
    const d = new Date(s.ts).toDateString();
    if (d === today) groupedSessions.Today.push(s);
    else if (d === yesterday) groupedSessions.Yesterday.push(s);
    else groupedSessions.Older.push(s);
  });

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}
      
      <Sidebar 
        sidebarOpen={sidebarOpen}
        groupedSessions={groupedSessions}
        currentSessionId={currentSessionId}
        loadSession={loadSession}
        deleteSession={deleteSession}
        newChat={newChat}
        apiStatus={apiStatus}
        apiStatusLabel={apiStatus === 'online' ? 'Connected' : apiStatus === 'checking' ? 'Connecting...' : 'Offline'}
      />
      
      <main className="chat-main">
        {/* Mobile Header logic can be embedded here or extracted */}
        <div className="mobile-header">
          <button onClick={() => setSidebarOpen(true)}>☰</button>
          <span>Larperland</span>
        </div>

        <Messages messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
        
        <InputBar 
          inputText={inputText} 
          setInputText={setInputText} 
          sendMessage={sendMessage} 
          isLoading={isLoading} 
        />
      </main>
    </div>
  );
}
