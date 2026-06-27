import React from 'react';
import { Search, Code, Zap } from 'lucide-react';

export default function Features() {
  return (
    <section className="features-section" id="features">
      <p className="section-eyebrow">Why DevDocs AI</p>
      <div className="features-grid">
        <article className="feature-card">
          <div className="feature-icon"><Search /></div>
          <h2 className="feature-title">Source-grounded answers</h2>
          <p className="feature-desc">Every response is backed by real documentation — not guesswork.</p>
        </article>
        <article className="feature-card">
          <div className="feature-icon"><Code /></div>
          <h2 className="feature-title">Code-aware retrieval</h2>
          <p className="feature-desc">Understands code blocks, function signatures, and API references.</p>
        </article>
        <article className="feature-card">
          <div className="feature-icon"><Zap /></div>
          <h2 className="feature-title">Fast by design</h2>
          <p className="feature-desc">Hybrid vector search returns the right context in milliseconds.</p>
        </article>
      </div>
    </section>
  );
}
