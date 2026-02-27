const features = [
  {
    title: "Elastic Compute Mesh",
    text: "Instantly scale workloads across regions with zero-downtime balancing."
  },
  {
    title: "AI Traffic Routing",
    text: "Predictive routing engine optimizes latency and cost in real time."
  },
  {
    title: "Built-in Observability",
    text: "Trace every request with deep metrics, logs, and anomaly detection."
  },
  {
    title: "Zero-Trust Security",
    text: "End-to-end encryption, role-based access, and policy automation."
  },
  {
    title: "One-Click Integrations",
    text: "Connect with your existing CI/CD, billing, and identity stack instantly."
  },
  {
    title: "Global Edge Delivery",
    text: "Deliver sub-50ms experiences worldwide through an optimized edge fabric."
  }
];

const pricing = [
  {
    tier: "Starter",
    price: "$29",
    period: "/month",
    description: "For early-stage products validating traction.",
    items: ["Up to 3 projects", "100k requests/month", "Community support"],
    cta: "Start Free Trial"
  },
  {
    tier: "Growth",
    price: "$99",
    period: "/month",
    featured: true,
    description: "For teams scaling infrastructure and revenue.",
    items: [
      "Unlimited projects",
      "2M requests/month",
      "Advanced analytics",
      "Priority support"
    ],
    cta: "Get Growth"
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "",
    description: "For mission-critical systems with enterprise requirements.",
    items: [
      "Dedicated cluster",
      "SLA + SSO",
      "Custom compliance controls",
      "Technical account manager"
    ],
    cta: "Contact Sales"
  }
];

const testimonials = [
  {
    quote:
      "ultra-grid-448 cut our infra latency by 41% in one week. It feels unfair.",
    name: "Maya Chen",
    role: "CTO, NeuronStack"
  },
  {
    quote:
      "The best developer experience we’ve had in years—clean APIs, real observability, and no nonsense.",
    name: "Ari Patel",
    role: "Head of Platform, Fluxforge"
  },
  {
    quote:
      "We migrated in a weekend and immediately saved five figures a month.",
    name: "Sofia Laurent",
    role: "VP Engineering, ZenithOS"
  }
];

export default function HomePage() {
  return (
    <main>
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <header className="container nav">
        <div className="brand">ultra-grid-448</div>
        <nav>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
        </nav>
        <button className="btn btn-ghost">Sign in</button>
      </header>

      <section className="container hero">
        <p className="eyebrow fade-up">AI-native infrastructure for modern SaaS</p>
        <h1 className="fade-up delay-1">
          Build faster on a
          <span className="gradient-text"> limitless ultra grid</span>
        </h1>
        <p className="hero-copy fade-up delay-2">
          ultra-grid-448 helps you launch, scale, and secure your product with
          a premium cloud fabric engineered for speed and reliability.
        </p>
        <div className="hero-actions fade-up delay-3">
          <button className="btn btn-primary">Start Free Trial</button>
          <button className="btn btn-secondary">Book Demo</button>
        </div>
        <div className="hero-metrics fade-up delay-4">
          <div>
            <strong>99.99%</strong>
            <span>Uptime SLA</span>
          </div>
          <div>
            <strong>&lt;50ms</strong>
            <span>Global latency</span>
          </div>
          <div>
            <strong>12k+</strong>
            <span>Teams onboarded</span>
          </div>
        </div>
      </section>

      <section id="features" className="container section">
        <div className="section-head">
          <p className="eyebrow">Features</p>
          <h2>Everything you need to operate at enterprise speed</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="card feature-card" key={feature.title}>
              <div className="icon-wrap" aria-hidden>
                ✦
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="container section">
        <div className="section-head">
          <p className="eyebrow">Pricing</p>
          <h2>Simple plans that scale with your ambition</h2>
        </div>
        <div className="pricing-grid">
          {pricing.map((plan) => (
            <article
              className={`card pricing-card ${plan.featured ? "featured" : ""}`}
              key={plan.tier}
            >
              {plan.featured && <span className="badge">Most Popular</span>}
              <h3>{plan.tier}</h3>
              <p className="plan-desc">{plan.description}</p>
              <p className="price">
                {plan.price}
                <span>{plan.period}</span>
              </p>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button className="btn btn-primary full">{plan.cta}</button>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="container section">
        <div className="section-head">
          <p className="eyebrow">Testimonials</p>
          <h2>Teams shipping faster with ultra-grid-448</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <article className="card testimonial-card" key={t.name}>
              <p className="quote">“{t.quote}”</p>
              <p className="author">{t.name}</p>
              <p className="role">{t.role}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="container footer">
        <div>
          <p className="brand">ultra-grid-448</p>
          <p className="muted">Premium cloud grid for unstoppable SaaS teams.</p>
        </div>
        <div className="footer-links">
          <a href="#">Docs</a>
          <a href="#">Security</a>
          <a href="#">Status</a>
          <a href="#">Contact</a>
        </div>
        <p className="muted">© {new Date().getFullYear()} ultra-grid-448, Inc.</p>
      </footer>
    </main>
  );
}
