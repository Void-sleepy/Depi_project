import React from 'react';

export default function Steps() {
  return (
    <section className="steps-section">
      <div className="steps-grid">
        <div className="step">
          <span className="step-num">01</span>
          <h3 className="step-title">Ask a question</h3>
          <p className="step-desc">Type anything about your docs — APIs, setup, or code examples.</p>
        </div>
        <div className="step">
          <span className="step-num">02</span>
          <h3 className="step-title">Retrieve context</h3>
          <p className="step-desc">Relevant passages are pulled from your indexed documentation.</p>
        </div>
        <div className="step">
          <span className="step-num">03</span>
          <h3 className="step-title">Get your answer</h3>
          <p className="step-desc">A clear response with sources you can verify instantly.</p>
        </div>
      </div>
    </section>
  );
}
