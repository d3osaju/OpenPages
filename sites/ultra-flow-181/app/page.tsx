export default function Home() {
  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">ultra-flow-181</div>
        <a href="#cta" className="top-cta">Book Demo</a>
      </header>

      <section className="hero">
        <p className="eyebrow">Corporate Professional</p>
        <h1>Operational clarity for teams that scale fast.</h1>
        <p className="subtitle">
          ultra-flow-181 centralizes planning, approvals, and execution into a single command center so your teams ship with confidence.
        </p>
        <div className="hero-actions" id="cta">
          <button>Start Free Trial</button>
          <button className="ghost">See Enterprise Plan</button>
        </div>
      </section>

      <section className="stats">
        <article><h3>38%</h3><p>faster release cycles</p></article>
        <article><h3>99.95%</h3><p>uptime SLA</p></article>
        <article><h3>120+</h3><p>integrations out of the box</p></article>
      </section>
    </main>
  );
}
