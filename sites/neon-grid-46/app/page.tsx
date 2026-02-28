const features = [
  {
    title: "Live Usage Intelligence",
    text: "Track product behavior in real-time with actionable insights and instant anomaly detection."
  },
  {
    title: "No-Code Workflow Engine",
    text: "Automate repetitive operations with visual workflows and event-driven logic."
  },
  {
    title: "Lightning API Layer",
    text: "Ship robust integrations in minutes using secure, scalable endpoints and webhooks."
  },
  {
    title: "Enterprise-Grade Security",
    text: "SOC-ready controls, SSO, role-based access, and full audit logs out of the box."
  },
  {
    title: "Smart Alerting",
    text: "Cut notification noise with AI-prioritized alerts tailored to your team’s context."
  },
  {
    title: "Global Edge Performance",
    text: "Deliver low-latency experiences worldwide through edge caching and auto-scaling."
  }
];

const pricing = [
  {
    name: "Starter",
    price: "$19",
    period: "/mo",
    description: "For small teams validating ideas quickly.",
    features: ["Up to 3 projects", "Basic analytics", "Community support"]
  },
  {
    name: "Growth",
    price: "$79",
    period: "/mo",
    description: "For scaling SaaS teams that need velocity.",
    features: ["Unlimited projects", "Advanced workflows", "Priority support"],
    highlight: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex requirements.",
    features: ["Dedicated infrastructure", "Custom SLAs", "Security & compliance suite"]
  }
];

const testimonials = [
  {
    quote:
      "neon-grid-46 helped us cut incident response time by 62% in the first month.",
    name: "Avery Chen",
    role: "VP Engineering, FluxScale"
  },
  {
    quote:
      "The onboarding was absurdly fast. We had our automation flows running the same day.",
    name: "Mina Patel",
    role: "Head of Product, Orbitly"
  },
  {
    quote:
      "Finally, a platform that balances power and clarity without the usual enterprise bloat.",
    name: "Darius Cole",
    role: "CTO, Northbeam Labs"
  }
];

export default function HomePage() {
  return (
    <main className="site">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="grid-overlay" />

      <header className="nav container">
        <div className="brand">
          <span className="brand-dot" />
          <span>neon-grid-46</span>
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
        </nav>
        <button className="btn btn-ghost">Sign In</button>
      </header>

      <section className="hero container">
        <p className="badge">Now in public beta</p>
        <h1>
          Build with the <span>Neon Grid</span> advantage.
        </h1>
        <p className="hero-copy">
          neon-grid-46 is your high-performance SaaS control plane for automation, observability,
          and secure scale — all from one beautifully simple interface.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary">Start Free Trial</button>
          <button className="btn btn-secondary">Book a Demo</button>
        </div>
        <div className="hero-proof">
          <span>Trusted by 2,000+ product teams</span>
          <div className="proof-avatars" aria-hidden>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section id="features" className="section container">
        <div className="section-head">
          <h2>Everything you need to scale intelligently</h2>
          <p>Built for modern teams shipping fast without sacrificing reliability.</p>
        </div>
        <div className="feature-grid">
          {features.map((item) => (
            <article key={item.title} className="card feature-card">
              <div className="icon-glow" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="section container">
        <div className="section-head">
          <h2>Simple pricing, serious power</h2>
          <p>Choose a plan that fits your stage. Upgrade whenever you're ready.</p>
        </div>
        <div className="pricing-grid">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`card pricing-card${plan.highlight ? " pricing-highlight" : ""}`}
            >
              <h3>{plan.name}</h3>
              <p className="price">
                <span>{plan.price}</span>
                {plan.period}
              </p>
              <p className="muted">{plan.description}</p>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button className={`btn ${plan.highlight ? "btn-primary" : "btn-secondary"}`}>
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="section container">
        <div className="section-head">
          <h2>Loved by builders shipping at speed</h2>
          <p>Teams across product, engineering, and operations rely on neon-grid-46 daily.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <figure key={t.name} className="card testimonial-card">
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className="footer container">
        <div>
          <div className="brand">
            <span className="brand-dot" />
            <span>neon-grid-46</span>
          </div>
          <p>© {new Date().getFullYear()} neon-grid-46. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <a href="#">Docs</a>
          <a href="#">Security</a>
          <a href="#">Status</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </main>
  );
}
