 import { Shield, ArrowRight } from "lucide-react";
import "./landing.css";
import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div className="landing-shell">

      <header className="landing-header">

        <div className="brand-wrap">
          <div style={{fontSize:"40px"}}>
            🌿
          </div>

          <div>
            <div className="brand-text">
              Socio<span>Sphere</span>
            </div>

            <div className="brand-tagline">
              One Community. Everything Connected.
            </div>
          </div>
        </div>

        <nav className="landing-nav">
          <button className="nav-link active">Home</button>
          <Link to="/citizen/dashboard" className="nav-link">Dashboard</Link>
          <button className="nav-link">Services</button>
          <button className="nav-link">Community</button>
          <button className="nav-link">About Us</button>
          <button className="nav-link">Contact</button>
        </nav>

        <div className="header-actions">
          <button className="language-btn">EN</button>
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/login" className="signup-btn">Sign Up</Link>
        </div>

      </header>


      <main className="landing-hero">

        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/bg-animated.mp4" type="video/mp4" />
        </video>

        <div className="image-overlay"></div>


        <div className="hero-content">

          <div className="hero-label">
            BUILDING BETTER COMMUNITIES
          </div>

          <h1 className="hero-title">
            One Community.
            <span>Everything Connected.</span>
          </h1>

          <p className="hero-description">
            SocioSphere brings your neighborhood together with
            community updates, local services, events, issue reporting,
            and meaningful connections.
          </p>

          <div className="cta-row">

            <Link to="/login"className="primary-cta">
              Join Your Community
              <ArrowRight size={18} />
            </Link>

            <button className="secondary-cta">
              Explore SocioSphere
            </button>

          </div>

        </div>

      </main>


      <section className="intro-section">

        <p className="section-label">
          EVERYTHING YOU NEED
        </p>

        <h2>
          All in One Place.
        </h2>

        <p className="section-description">
          Stay informed, stay connected, and take an active part
          in the community around you.
        </p>

      </section>

    </div>
  );
}

