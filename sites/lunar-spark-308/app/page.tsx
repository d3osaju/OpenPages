const features = [
  {
    title: "AI Workflow Engine",
    description:
      "Automate repetitive operations with adaptive flows that learn from your team’s behavior."
  },
  {
    title: "Real-Time Analytics",
    description:
      "Track performance instantly with beautiful dashboards and zero-lag event streaming."
  },
  {
    title: "Secure Collaboration",
    description:
      "Role-based access, audit trails, and enterprise-grade encryption out of the box."
  },
  {
    title: "One-Click Integrations",
    description:
      "Connect your favorite tools in seconds with pre-built connectors and smart sync."
  },
  {
    title: "Smart Alerts",
    description:
      "Get meaningful notifications only when critical thresholds or growth opportunities appear."
  },
  {
    title: "Global Scale",
    description:
      "Deliver low-latency experiences worldwide with our resilient, distributed infrastructure."
  }
];

const pricing = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For solo builders launching fast.",
    points: ["Up to 3 projects", "Basic analytics", "Email support"]
  },
  {
    name: "Growth",
    price: "$99",
    period: "/month",
    highlighted: true,
    description: "For scaling teams that need power.",
    points: ["Unlimited projects", "Advanced analytics", "Priority support", "Team permissions"]
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with complex needs.",
    points: ["Dedicated success manager", "SLA + SSO", "Custom integrations", "Security reviews"]
  }
];

const testimonials = [
  {
    quote:
      "lunar-spark-308 replaced three tools for us. We ship faster and see everything in one place.",
    name: "Maya Chen",
    role: "Head of Product, Northlane"
  },
  {
    quote:
      "The automation engine feels like an extra teammate. Setup was quick, impact was immediate.",
    name: "Darius Bell",
    role: "Founder, Orbit Forge"
  },
  {
    quote:
      "From onboarding to scale, the experience is premium. It just works—and looks incredible.",
    name: "Sofia N.",
    role: "COO, HaloStack"
  }
];

export default function HomePage() {
  return (
    <main className="page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-grid" />

      <header className="hero container">
        <span className="pill">Now powering high-velocity SaaS teams</span>
        <h1>
          Build smarter with <span className="gradient-text">lunar-spark-308</span>
        </h1>
        <p>
          The premium growth platform that unifies automation, analytics, and collaboration in one
          dark-mode command center.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#pricing">
            Start Free Trial
          </a>
          <a className="btn btn-ghost" href="#features">
            Explore Features
          </a>
        </div>
      </header>

      <section id="features" className="section container">
        <div className="section-head">
          <h2>Everything you need to move at lunar speed</h2>
          <p>Crafted for founders, operators, and product teams who value precision and momentum.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="card feature-card">
              <div className="feature-icon" aria-hidden>
                ✦
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Trusted by ambitious teams</h2>
          <p>Real words from leaders building products users love.</p>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="card testimonial-card">
              <p className="quote">“{item.quote}”</p>
              <div className="person">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="section container">
        <div className="section-head">
          <h2>Simple pricing, serious performance</h2>
          <p>Choose a plan that matches your stage and scale when you’re ready.</p>
        </div>
        <div className="pricing-grid">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`card pricing-card ${plan.highlighted ? "pricing-card--featured" : ""}`}
            >
              {plan.highlighted ? <span className="badge">Most Popular</span> : null}
              <h3>{plan.name}</h3>
              <p className="price">
                <span>{plan.price}</span>
                <small>{plan.period}</small>
              </p>
              <p className="plan-desc">{plan.description}</p>
              <ul>
                {plan.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <a href="#" className={`btn ${plan.highlighted ? "btn-primary" : "btn-ghost"}`}>
                {plan.name === "Enterprise" ? "Contact Sales" : "Choose Plan"}
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer container">
        <div>
          <strong>lunar-spark-308</strong>
          <p>Ignite growth. Keep momentum. Scale with confidence.</p>
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#">Docs</a>
          <a href="#">Contact</a>
        </nav>
      </footer>
    </main>
  );
}
