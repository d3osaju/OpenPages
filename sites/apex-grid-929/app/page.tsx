const features = [
  {
    title: "Realtime Grid Analytics",
    desc: "See every signal update in milliseconds with live dashboards and anomaly alerts.",
    icon: "⚡",
  },
  {
    title: "AI Workflow Builder",
    desc: "Design automations visually, then let Apex AI optimize flow efficiency continuously.",
    icon: "🧠",
  },
  {
    title: "Global Edge Sync",
    desc: "Deploy near users worldwide with edge-native data replication and instant failover.",
    icon: "🌍",
  },
  {
    title: "Enterprise Security",
    desc: "SOC-ready controls, SSO, RBAC, audit trails, and encrypted data at rest and in transit.",
    icon: "🔒",
  },
  {
    title: "Predictive Capacity Engine",
    desc: "Forecast demand spikes before they happen and scale automatically with precision.",
    icon: "📈",
  },
  {
    title: "No-Code API Control",
    desc: "Connect services, transform payloads, and govern APIs without writing custom glue code.",
    icon: "🧩",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "$29",
    desc: "Perfect for small teams launching fast.",
    items: ["Up to 5 projects", "Realtime dashboards", "Basic automations", "Email support"],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Growth",
    price: "$99",
    desc: "For scaling SaaS teams that need power.",
    items: ["Up to 25 projects", "Advanced AI workflows", "Priority support", "Team permissions"],
    cta: "Get Growth",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Security, scale, and compliance without compromise.",
    items: ["Unlimited projects", "Dedicated success manager", "SLA + uptime guarantees", "Custom integrations"],
    cta: "Talk to Sales",
    featured: false,
  },
];

const testimonials = [
  {
    quote:
      "Apex Grid replaced three tools in our stack and cut incident response time by 61%.",
    name: "Mira Chen",
    role: "VP Engineering, VoltScale",
  },
  {
    quote:
      "The workflow builder is insanely good. We launched new automations in a single afternoon.",
    name: "Jordan Hale",
    role: "Head of Ops, Northstar Cloud",
  },
  {
    quote:
      "Dark-mode UI, blazing speed, and enterprise controls. This is exactly what modern teams need.",
    name: "Sofia Ramirez",
    role: "CTO, PrismForge",
  },
];

export default function Page() {
  return (
    <main>
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <section className="container hero">
        <span className="pill reveal">Now shipping v2.9 • AI Grid Intelligence</span>
        <h1 className="reveal delay-1">
          Build at the speed of
          <span className="gradient"> apex-grid-929</span>
        </h1>
        <p className="hero-copy reveal delay-2">
          Apex Grid unifies analytics, orchestration, and automation in one premium platform.
          Move faster, scale cleaner, and make smarter decisions in real time.
        </p>
        <div className="hero-cta reveal delay-3">
          <button className="btn btn-primary">Start Free Trial</button>
          <button className="btn btn-ghost">Book a Demo</button>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Everything your grid needs to win</h2>
          <p>
            Purpose-built features engineered for modern SaaS teams handling rapid growth and complex data flows.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <article key={f.title} className="card feature-card">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Simple pricing. Serious performance.</h2>
          <p>Choose the plan that matches your momentum. Upgrade anytime.</p>
        </div>
        <div className="pricing-grid">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`card pricing-card ${tier.featured ? "featured" : ""}`}
            >
              <h3>{tier.name}</h3>
              <p className="price">{tier.price}</p>
              <p className="tier-desc">{tier.desc}</p>
              <ul>
                {tier.items.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
              <button className={`btn ${tier.featured ? "btn-primary" : "btn-ghost"}`}>
                {tier.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Trusted by teams shipping at scale</h2>
          <p>What customers say after switching to Apex Grid.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <article key={t.name} className="card testimonial-card">
              <p className="quote">“{t.quote}”</p>
              <div className="author">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="container footer">
        <div>
          <h4>apex-grid-929</h4>
          <p>Scale intelligence at grid speed.</p>
        </div>
        <nav>
          <a href="#">Product</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
          <a href="#">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
