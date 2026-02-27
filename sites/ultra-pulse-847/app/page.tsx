const features = [
  {
    icon: "⚡",
    title: "Real-Time Signal Engine",
    desc: "Capture high-value behavioral signals across your product in milliseconds."
  },
  {
    icon: "🧠",
    title: "Adaptive AI Scoring",
    desc: "Prioritize accounts and users with continuously learning propensity models."
  },
  {
    icon: "🔄",
    title: "No-Code Automations",
    desc: "Ship sophisticated growth workflows with a visual orchestration builder."
  },
  {
    icon: "📈",
    title: "Revenue Intelligence",
    desc: "Tie every campaign, touchpoint, and experiment directly to pipeline impact."
  },
  {
    icon: "🛡️",
    title: "Enterprise-Grade Security",
    desc: "SSO, role-based permissions, and audit trails built for regulated teams."
  },
  {
    icon: "🌐",
    title: "Global Performance",
    desc: "Low-latency architecture that scales to millions of events per minute."
  }
];

const pricing = [
  {
    name: "Starter",
    price: "$29",
    subtitle: "For early-stage teams",
    features: ["Up to 10k events/month", "3 team seats", "Core automations", "Email support"],
    cta: "Start Free",
    highlighted: false
  },
  {
    name: "Growth",
    price: "$99",
    subtitle: "For scaling companies",
    features: [
      "Up to 250k events/month",
      "Unlimited seats",
      "Advanced AI scoring",
      "Priority support",
      "A/B experimentation"
    ],
    cta: "Get Growth",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    subtitle: "For high-scale organizations",
    features: [
      "Unlimited events",
      "Dedicated success manager",
      "Custom integrations",
      "SLA + security reviews",
      "Private deployment options"
    ],
    cta: "Contact Sales",
    highlighted: false
  }
];

const testimonials = [
  {
    quote:
      "ultra-pulse-847 helped us cut campaign iteration time from weeks to hours. The impact was immediate.",
    name: "Maya Chen",
    role: "VP Growth, ArcNova"
  },
  {
    quote:
      "The signal quality is unreal. We now know exactly where to focus, and our conversion rates jumped 38%.",
    name: "Daniel Brooks",
    role: "Head of Product, FluxGrid"
  },
  {
    quote:
      "Implementation was fast, and the platform feels premium. It became a core part of our GTM stack.",
    name: "Sofia Rahman",
    role: "Revenue Ops Lead, Coreline"
  }
];

export default function HomePage() {
  return (
    <main>
      <div className="background-glow glow-1" />
      <div className="background-glow glow-2" />
      <div className="background-glow glow-3" />

      <header className="container nav">
        <div className="brand">ultra-pulse-847</div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#footer">Contact</a>
        </nav>
        <a href="#pricing" className="btn btn-sm btn-ghost">
          Get Started
        </a>
      </header>

      <section className="container hero">
        <p className="eyebrow fade-up">AI Growth Infrastructure</p>
        <h1 className="hero-title fade-up delay-1">
          Turn every product signal into <span className="gradient-text">predictable revenue</span>
        </h1>
        <p className="hero-subtitle fade-up delay-2">
          ultra-pulse-847 combines real-time data, adaptive intelligence, and automation to help
          modern teams move faster and scale smarter.
        </p>
        <div className="hero-cta fade-up delay-3">
          <a href="#pricing" className="btn btn-primary">
            Start Free Trial
          </a>
          <a href="#features" className="btn btn-ghost">
            Explore Features
          </a>
        </div>
        <div className="hero-metrics fade-up delay-4">
          <div>
            <strong>99.99%</strong>
            <span>Uptime</span>
          </div>
          <div>
            <strong>2.4x</strong>
            <span>Faster Campaign Velocity</span>
          </div>
          <div>
            <strong>38%</strong>
            <span>Average Conversion Lift</span>
          </div>
        </div>
      </section>

      <section id="features" className="container section">
        <h2 className="section-title">Features built to move at your speed</h2>
        <p className="section-copy">
          Everything you need to detect opportunity, orchestrate action, and prove impact.
        </p>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="card feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="container section">
        <h2 className="section-title">Simple pricing, serious power</h2>
        <p className="section-copy">Choose the plan that matches your stage and scale confidently.</p>
        <div className="pricing-grid">
          {pricing.map((tier) => (
            <article
              key={tier.name}
              className={`card pricing-card ${tier.highlighted ? "pricing-highlighted" : ""}`}
            >
              <p className="tier-name">{tier.name}</p>
              <p className="tier-price">{tier.price}</p>
              <p className="tier-subtitle">{tier.subtitle}</p>
              <ul>
                {tier.features.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
              <a href="#footer" className={`btn ${tier.highlighted ? "btn-primary" : "btn-ghost"}`}>
                {tier.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="container section">
        <h2 className="section-title">Loved by ambitious teams</h2>
        <p className="section-copy">
          From startup operators to enterprise leaders, teams trust ultra-pulse-847 to execute with
          confidence.
        </p>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="card testimonial-card">
              <p className="quote">“{testimonial.quote}”</p>
              <p className="person">{testimonial.name}</p>
              <p className="role">{testimonial.role}</p>
            </article>
          ))}
        </div>
      </section>

      <footer id="footer" className="container footer">
        <div>
          <p className="brand">ultra-pulse-847</p>
          <p className="muted">Build faster. Decide smarter. Grow without guesswork.</p>
        </div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#">Docs</a>
          <a href="#">Privacy</a>
        </div>
      </footer>
    </main>
  );
}
