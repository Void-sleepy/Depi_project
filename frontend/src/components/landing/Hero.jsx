import React from 'react';
import { Search, Sparkles, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">RAG assistant for developers</p>
        <h1 className="hero-headline">
          Ask your docs.<br />
          Get <span className="accent">answers</span>.
        </h1>
        <p className="hero-sub">
          Source-grounded responses from your technical documentation — fast, accurate, and ready when you are.
        </p>
        <div className="hero-actions">
          <Link to="/chat" className="hero-cta">Start asking →</Link>
          <a href="#features" className="hero-cta-secondary">See how it works</a>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-glow"></div>
          <div className="hero-visual-card">
            <div className="visual-row">
              <span className="visual-icon"><Search /></span>
              <div className="visual-lines">
                <span className="visual-line wide"></span>
                <span className="visual-line"></span>
              </div>
            </div>
            <div className="visual-row">
              <span className="visual-icon accent"><Sparkles /></span>
              <div className="visual-lines">
                <span className="visual-line"></span>
                <span className="visual-line wide"></span>
                <span className="visual-line short"></span>
              </div>
            </div>
            <div className="visual-row">
              <span className="visual-icon"><FileText /></span>
              <div className="visual-lines">
                <span className="visual-line"></span>
                <span className="visual-line short"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
