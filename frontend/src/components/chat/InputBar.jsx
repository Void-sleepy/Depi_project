import React, { useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function InputBar({ inputText, setInputText, sendMessage, isLoading }) {
  const textareaRef = useRef(null);

  const grow = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  };

  useEffect(() => {
    grow();
  }, [inputText]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => { setInputText(e.target.value); grow(); }}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documentation…"
          disabled={isLoading}
          rows={1}
        />
        <button 
          type="button" 
          className="send-btn" 
          onClick={sendMessage} 
          disabled={isLoading || !inputText.trim()} 
          aria-label="Send"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
      <p className="input-hint">Ctrl+Enter to send · answers are grounded in documentation</p>
    </div>
  );
}
