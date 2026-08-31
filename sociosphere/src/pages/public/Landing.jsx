import { ArrowRight, Shield } from "lucide-react";
import "./landing.css";

export default function Landing() {
  return (
    <div className="landing-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <header className="landing-header">
        <div className="brand-wrap">
          <div className="brand-mark">
            <Shield size={18} />
          </div>
          <div className="brand-text">SocioSphere</div>
        </div>

        <nav className="landing-nav" aria-label="Main navigation">
          <button className="nav-pill active">Home</button>
          <button className="nav-pill">Explore</button>
        </nav>

        <div className="header-actions">
          <button className="sign-in-btn">Sign In</button>
          <button className="start-btn">Get Started</button>
        </div>
      </header>

      <main className="landing-hero">
        <div className="photo-grid" aria-hidden="true">
          <div className="photo photo-fireworks" />
          <div className="photo photo-community" />
          <div className="photo photo-festival" />
        </div>

        <div className="hero-content">
          <div className="floating-tag">Join Stronger Communities Together</div>

          <h1 className="hero-title">
            <span>Connect. Collaborate.</span>
            <span className="accent">Community.</span>
          </h1>

          <div className="hero-text-block">
            <p>
              SocioSphere brings your neighborhood together — report issues,
              join events, chat with neighbors, and build the community you’ve
              always wanted.
            </p>

            <div className="cta-row">
              <button className="primary-cta">
                Get Started Free
                <ArrowRight size={18} />
              </button>
              <button className="secondary-cta">Sign In</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
