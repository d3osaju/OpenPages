const features = [
{
title: "Live Signal Monitoring",
description:
"Track every KPI, alert, and anomaly in real time with zero dashboard lag."
},
{
title: "AI Workflow Autopilot",
description:
"Automate repetitive operational flows with adaptive, no-code intelligence."
},
{
title: "Unified Data Layer",
description:
"Connect product, support, and revenue data in one secure source of truth."
},
{
title: "Predictive Insights",
description:
"Forecast churn, growth, and risk before they impact your business outcomes."
},
{
title: "Role-Based Access",
description:
"Enterprise-grade permissions ensure every team sees exactly what they need."
},
{
title: "Lightning Integrations",
description:
"Plug into Slack, Notion, HubSpot, Stripe, and more in just a few clicks."
}
];

const pricing = [
{
name: "Starter",
price: "$29",
blurb: "For teams launching fast",
points: ["Up to 3 workspaces", "Basic automations", "Email support"],
cta: "Start Free"
},
{
name: "Growth",
price: "$99",
blurb: "For scaling SaaS operators",
points: ["Unlimited dashboards", "Advanced automations", "Priority support"],
cta: "Get Growth",
featured: true
},
{
name: "Enterprise",
price: "Custom",
blurb: "For mission-critical operations",
points: ["SSO + SCIM", "Dedicated success manager", "Custom SLAs"],
cta: "Contact Sales"
}
];

const testimonials = [
{
quote:
"zenith-pulse-508 gave us a single view of reality across product, support, and revenue.",
author: "Avery Chen",
role: "VP Operations, Northline"
},
{
quote:
"We replaced five disconnected tools and cut incident response time by 46%.",
author: "Mina Patel",
role: "Head of Platform, LumaStack"
},
{
quote:
"The automation engine feels like adding another senior operator to the team.",
author: "Jonas Reed",
role: "COO, Brightforge"
}
];

export default function HomePage() {
return (
<main className="page">
<div className="bg-glow bg-glow-1" />
<div className="bg-glow bg-glow-2" />

<header className="container nav">
<div className="brand">
<span className="brand-dot" />
zenith-pulse-508
</div>
<nav className="nav-links">
<a href="#features">Features</a>
<a href="#pricing">Pricing</a>
<a href="#testimonials">Testimonials</a>
</nav>
</header>

<section className="container hero">
<div className="pill">New: Adaptive Incident Playbooks</div>
<h1>
Command your SaaS in
<span className="gradient-text"> real-time clarity</span>
</h1>
<p>
zenith-pulse-508 gives modern teams one powerful control center to
monitor signals, automate decisions, and scale confidently.
</p>
<div className="hero-cta">
<a className="btn btn-primary" href="#pricing">
Start Free Trial
</a>
<a className="btn btn-ghost" href="#features">
Explore Platform
</a>
</div>
<div className="hero-metrics">
<div>
<strong>99.99%</strong>
<span>Platform uptime</span>
</div>
<div>
<strong>&lt;120ms</strong>
<span>Signal processing</span>
</div>
<div>
<strong>10k+</strong>
<span>Teams onboarded</span>
</div>
</div>
</section>

<section id="features" className="container section">
<h2>Everything your team needs to move faster</h2>
<p className="section-sub">
Purpose-built capabilities for high-velocity SaaS execution.
</p>
<div className="feature-grid">
{features.map((feature) => (
<article className="card feature-card" key={feature.title}>
<div className="icon-wrap">✦</div>
<h3>{feature.title}</h3>
<p>{feature.description}</p>
</article>
))}
</div>
</section>

<section id="pricing" className="container section">
<h2>Simple pricing, built to scale</h2>
<p className="section-sub">Choose a plan that matches your momentum.</p>
<div className="pricing-grid">
{pricing.map((plan) => (
<article
className={`card pricing-card ${plan.featured ? "featured" : ""}`}
key={plan.name}
>
{plan.featured ? <div className="badge">Most Popular</div> : null}
<h3>{plan.name}</h3>
<p className="price">
{plan.price}
{plan.price !== "Custom" ? <span>/mo</span> : null}
</p>
<p className="pricing-blurb">{plan.blurb}</p>
<ul>
{plan.points.map((point) => (
<li key={point}>✓ {point}</li>
))}
</ul>
<a className={`btn ${plan.featured ? "btn-primary" : "btn-ghost"}`} href="#">
{plan.cta}
</a>
</article>
))}
</div>
</section>

<section id="testimonials" className="container section">
<h2>Loved by modern SaaS operators</h2>
<p className="section-sub">
Trusted by teams that run lean and move with precision.
</p>
<div className="testimonial-grid">
{testimonials.map((item) => (
<article className="card testimonial-card" key={item.author}>
<p className="quote">“{item.quote}”</p>
<div className="person">
<strong>{item.author}</strong>
<span>{item.role}</span>
</div>
</article>
))}
</div>
</section>

<footer className="container footer">
<div className="footer-brand">
<span className="brand-dot" />
zenith-pulse-508
</div>
<div className="footer-links">
<a href="#">Docs</a>
<a href="#">Security</a>
<a href="#">Status</a>
<a href="#">Contact</a>
</div>
<p>© {new Date().getFullYear()} zenith-pulse-508. All rights reserved.</p>
</footer>
</main>
);
}
