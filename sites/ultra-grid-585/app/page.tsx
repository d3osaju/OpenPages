const pillars = [
  { title: "Signal Grid", text: "Track momentum, conversions, and velocity in one geometric control board." },
  { title: "Launch Engine", text: "Spin up campaigns with modular blocks, instant previews, and zero bottlenecks." },
  { title: "Pulse Automations", text: "Set rule-based flows that react to behavior in real time across channels." },
  { title: "Team Sync", text: "Give product, growth, and design one source of truth with sharp visual clarity." }
];

export default function Home() {
  return (
    <main className="page">
      <header className="topbar">
        <div className="container row">
          <div className="logo"><span>UG</span> ultra-grid-585</div>
          <a className="btn ghost" href="#cta">Start Free</a>
        </div>
      </header>

      <section className="hero container">
        <p className="kicker">NEO-GEO SYSTEM</p>
        <h1>Turn ideas into launch-ready pages at grid speed.</h1>
        <p className="lead">ultra-grid-585 combines hard-edged visuals, rapid workflows, and measurable growth loops in one striking interface.</p>
        <div className="actions">
          <a className="btn primary" href="#cta">Generate a Site</a>
          <a className="btn ghost" href="#features">See Features</a>
        </div>
      </section>

      <section id="features" className="container cards">
        {pillars.map((p) => (
          <article key={p.title} className="card">
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </section>

      <section className="container statband">
        <div><strong>3.8x</strong><span>faster launch cycles</span></div>
        <div><strong>91%</strong><span>team adoption</span></div>
        <div><strong>+62%</strong><span>conversion lift</span></div>
      </section>

      <section id="cta" className="container cta">
        <h2>Ready to ship your next winning page?</h2>
        <p>Plug in your idea, choose your style, and publish in minutes.</p>
        <a className="btn primary" href="#">Launch ultra-grid-585</a>
      </section>
    </main>
  );
}
