import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Nav() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('devdocs_theme', newTheme);
  };

  return (
    <nav className="landing-nav">
      <Link to="/" className="nav-logo">DevDocs AI</Link>
      <div className="nav-actions">
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Switch theme">
          <Sun className="w-5 h-5 dark:hidden" />
          <Moon className="w-5 h-5 hidden dark:block" />
        </button>
        <Link to="/chat" className="nav-cta">Open chat →</Link>
      </div>
    </nav>
  );
}
