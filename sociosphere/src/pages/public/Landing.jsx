import { ArrowRight, Shield } from "lucide-react";
import "./landing.css";

export default function Landing() {
  return (
    <div className="landing-shell">

      <header className="landing-header">

        <div className="brand-wrap">
          <div className="brand-mark">
            <Shield size={19} />
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
          <button className="nav-link">About Us</button>
          <button className="nav-link">Dashboard</button>
          <button className="nav-link">Services</button>
          <button className="nav-link">Community</button>
          <button className="nav-link">Contact</button>
        </nav>

        <div className="header-actions">
          <button className="language-btn">EN</button>
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
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

            <button className="primary-cta">
              Join Your Community
              <ArrowRight size={18} />
            </button>

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