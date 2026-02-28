const stats = [
  ["3.4x", "faster launch cycles"],
  ["92%", "campaign velocity score"],
  ["47%", "lift in qualified leads"]
];

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="badge">KINETIC STYLE • NEXT-GEN GTM</p>
        <h1>hyper-spark-489</h1>
        <p className="lead">Turn every product release into a coordinated growth event with real-time orchestration, AI timing, and adaptive motion journeys.</p>
        <div className="actions">
          <a className="btn primary" href="#">Start Free</a>
          <a className="btn ghost" href="#">Watch Demo</a>
        </div>
        <div className="stats">
          {stats.map(([v, t]) => (
            <div key={v} className="card"><strong>{v}</strong><span>{t}</span></div>
          ))}
        </div>
      </section>
    </main>
  );
}
