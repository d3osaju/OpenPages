import ShowcaseGrid from "./components/ShowcaseGrid";
import CheckoutButton from "./components/CheckoutButton";

export default function Home() {
    const styles = [
        "Neobrutalist", "Swiss", "Editorial", "Glassmorphism", "Retro-Futuristic",
        "Bauhaus", "Art Deco", "Minimal", "Neumorphic", "Japandi",
        "Dark Mode", "Modernist", "Organic", "Tech Forward", "Luxury Minimal",
        "Gradient Modern", "Typography First", "Metropolitan", "Kinetic", "Neo-Geo",
        "Scandinavian", "Monochromatic", "Material", "Flat", "Corporate Pro"
    ];

    return (
        <main>
            {/* ───────── HERO ───────── */}
            <section className="hero" id="hero">
                <div className="hero-bg">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                    <div className="grid-overlay" />
                </div>

                <nav className="nav">
                    <div className="nav-logo">
                        <span className="logo-icon">◆</span>
                        <span className="logo-text">OpenPages</span>
                    </div>
                    <div className="nav-links">
                        <a href="#showcase">Showcase</a>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#styles">Styles</a>
                    </div>
                    <a href="#pricing" className="nav-cta">Get Started</a>
                </nav>

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot" />
                        25+ Design Styles • Premium Code • Instant Access
                    </div>
                    <h1 className="hero-title">
                        Landing Pages That
                        <br />
                        <span className="hero-gradient">Are Already Built</span>
                    </h1>
                    <p className="hero-subtitle">
                        A curated collection of stunning, production-ready landing pages.
                        <br />
                        Get the full Next.js source code for every design in the showcase.
                    </p>
                    <div className="hero-actions">
                        <a href="#pricing" className="btn btn-primary">
                            <span>Get the Full Pack</span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href="#showcase" className="btn btn-ghost">View Showcase</a>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">25+</span>
                            <span className="stat-label">Design Styles</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">Production Ready</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">Instant</span>
                            <span className="stat-label">Download</span>
                        </div>
                    </div>
                </div>

                <div className="hero-scroll-indicator">
                    <div className="scroll-line" />
                </div>
            </section>

            {/* ───────── SHOWCASE ───────── */}
            <section className="showcase" id="showcase">
                <ShowcaseGrid />
            </section>

            {/* ───────── WHAT YOU GET ───────── */}
            <section className="how-it-works" id="how-it-works">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">What You Get</span>
                        <h2 className="section-title">Everything You Need to Launch</h2>
                        <p className="section-desc">
                            Skip the design and development phase. Buy the pack and get immediate access to the source code for every template.
                        </p>
                    </div>

                    <div className="steps">
                        <div className="step">
                            <div className="step-number">01</div>
                            <div className="step-icon">💻</div>
                            <h3 className="step-title">Full Source Code</h3>
                            <p className="step-desc">
                                Get the complete Next.js and TypeScript source code for every single landing page in our showcase. Clean, modern, and easy to edit.
                            </p>
                            <div className="step-tags">
                                <span>Next.js</span>
                                <span>TypeScript</span>
                                <span>Vanilla CSS</span>
                            </div>
                        </div>

                        <div className="step-connector">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M12 24h24m0 0l-8-8m8 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className="step">
                            <div className="step-number">02</div>
                            <div className="step-icon">🎨</div>
                            <h3 className="step-title">25+ Design Styles</h3>
                            <p className="step-desc">
                                From Neobrutalism to Glassmorphism, get access to dozens of unique aesthetic styles to perfectly match your brand.
                            </p>
                            <div className="step-tags">
                                <span>Unique</span>
                                <span>Premium</span>
                                <span>Curated</span>
                            </div>
                        </div>

                        <div className="step-connector">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M12 24h24m0 0l-8-8m8 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <div className="step">
                            <div className="step-number">03</div>
                            <div className="step-icon">🚀</div>
                            <h3 className="step-title">Deploy Anywhere</h3>
                            <p className="step-desc">
                                Since you own the code, you can easily tweak the copy and deploy instantly to Vercel, Netlify, or your custom server.
                            </p>
                            <div className="step-tags">
                                <span>Vercel</span>
                                <span>Netlify</span>
                                <span>Custom</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── STYLES MARQUEE ───────── */}
            <section className="styles-section" id="styles">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Design Styles</span>
                        <h2 className="section-title">25+ Unique Aesthetics</h2>
                        <p className="section-desc">
                            Every page gets a randomly selected design style. No two sites look alike.
                        </p>
                    </div>

                    <div className="marquee-wrapper">
                        <div className="marquee-track">
                            {[...styles, ...styles].map((style, i) => (
                                <span key={i} className="marquee-item">{style}</span>
                            ))}
                        </div>
                    </div>
                    <div className="marquee-wrapper marquee-reverse">
                        <div className="marquee-track">
                            {[...styles.slice(12), ...styles.slice(0, 12), ...styles.slice(12), ...styles.slice(0, 12)].map((style, i) => (
                                <span key={i} className="marquee-item">{style}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── PRICING ───────── */}
            <section className="pricing" id="pricing">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Pricing</span>
                        <h2 className="section-title">One Simple Price</h2>
                        <p className="section-desc">
                            Get lifetime access to the entire collection of premium landing pages.
                        </p>
                    </div>

                    <div className="pricing-grid" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="pricing-card pricing-card-featured" style={{ maxWidth: '400px', width: '100%' }}>
                            <div className="pricing-popular">Lifetime Access</div>
                            <div className="pricing-tier">The Complete Pack</div>
                            <div className="pricing-price">
                                <span className="price-currency">$</span>
                                <span className="price-amount">29</span>
                                <span className="price-period">/one-time</span>
                            </div>
                            <ul className="pricing-features">
                                <li>All current landing pages</li>
                                <li>All future generated pages</li>
                                <li>Full Next.js source code</li>
                                <li>25+ premium design styles</li>
                                <li>Unlimited personal & commercial projects</li>
                                <li>One-time payment, yours forever</li>
                            </ul>
                            <CheckoutButton />
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── FOOTER ───────── */}
            <footer className="footer">
                <div className="section-container">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <span className="logo-icon">◆</span>
                            <span className="logo-text">OpenPages</span>
                            <p className="footer-tagline">
                                AI-generated landing pages, deployed instantly.
                            </p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-col">
                                <h4>Product</h4>
                                <a href="#showcase">Showcase</a>
                                <a href="#how-it-works">How It Works</a>
                                <a href="#pricing">Pricing</a>
                                <a href="#styles">Styles</a>
                            </div>
                            <div className="footer-col">
                                <h4>Company</h4>
                                <a href="https://zetalabs.in" target="_blank" rel="noopener noreferrer">ZetaLabs</a>
                                <a href="#">Blog</a>
                                <a href="#">Terms</a>
                                <a href="#">Privacy</a>
                            </div>
                            <div className="footer-col">
                                <h4>Connect</h4>
                                <a href="#">Discord</a>
                                <a href="https://github.com/d3osaju/OpenPages" target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href="#">Twitter / X</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 OpenPages by ZetaLabs. All rights reserved.</p>
                        <p>Powered by OpenClaw Agent Orchestra</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
