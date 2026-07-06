import React from 'react';
import { Sun, Moon, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar({ sidebarOpen, groupedSessions, currentSessionId, loadSession, deleteSession, newChat, apiStatusLabel, apiStatus }) {
  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('devdocs_theme', newTheme);
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">Larperland</Link>
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Switch theme">
          <Sun className="w-5 h-5 dark:hidden" />
          <Moon className="w-5 h-5 hidden dark:block" />
        </button>
      </div>

      <button className="new-chat-btn" type="button" onClick={newChat}>
        <Plus className="w-4 h-4" />
        New chat
      </button>

      <div className="sidebar-section">
        {Object.keys(groupedSessions).length === 0 ? (
          <p className="empty-history">No chats yet — start a new conversation.</p>
        ) : (
          Object.entries(groupedSessions).map(([label, items]) => (
            items.length > 0 && (
              <div key={label}>
                <div className="section-label">{label}</div>
                {items.map((session) => (
                  <div key={session.id} className={`history-row ${session.id === currentSessionId ? 'active' : ''}`}>
                    <button
                      className="history-item"
                      type="button"
                      onClick={() => loadSession(session.id)}
                    >
                      {session.title}
                    </button>
                    <button
                      className="history-delete"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                      aria-label="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <span className={`status-dot ${apiStatus}`}></span>
        <span>{apiStatusLabel}</span>
      </div>
    </aside>
  );
}
