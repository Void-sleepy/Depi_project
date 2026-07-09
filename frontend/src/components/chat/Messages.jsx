import React from 'react';

export default function Messages({ messages, isLoading, messagesEndRef }) {
  const formatSourceName = (src) => src.split('/').pop();
  
  return (
    <section className="messages">
      {messages.length === 0 && !isLoading && (
        <div className="empty-state">
          <h1 className="empty-title">Larperland</h1>
          <p className="empty-tagline">Ask anything about your AI documentation.</p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={`message-row ${msg.role}`}>
          <div className="message-block">
            <div className={`bubble ${msg.role}`}>
              <div className="bubble-content" dangerouslySetInnerHTML={{ __html: msg.html }}></div>
            </div>

            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && !msg.content.endsWith('▋') && (
              <div className="sources-panel">
                <div className="sources-label">Sources</div>
                <div className="sources-grid">
                  {msg.sources.map((src, idx) => (
                    <div key={idx} className="source-card">
                      <div className="source-filename">{formatSourceName(src)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {msg.role === 'assistant' && msg.latency && (
              <div className="latency">answered in {(msg.latency / 1000).toFixed(2)}s</div>
            )}
            
            {msg.role === 'user' && (
              <div className="message-time">{msg.timestamp}</div>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="typing-indicator" aria-label="Assistant is typing">
          <span></span><span></span><span></span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </section>
  );
}
