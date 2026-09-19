import { useState } from "react";
import { Shield, ArrowRight, AlertTriangle, ShieldAlert } from "lucide-react";
import "./landing.css";
import { Link } from "react-router-dom";
export default function Landing() {
  const [selectedFeature, setSelectedFeature] = useState("issues");
  return (
    <div className="landing-shell">

      <header className="landing-header">

        <div className="brand-wrap">
          <div style={{fontSize:"40px"}}>
          <img src="/logo_main.png" alt="SocioSphere" style={{ width: "40px", height: "40px" }} />
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
          <a href="#features" className="nav-link">
           Explore Features
          </a>
        {/*  <button className="nav-link active">Home</button>*/}
        {/*  <Link to="/citizen/dashboard" className="nav-link">Dashboard</Link>*/}     
         {/* <button className="nav-link">Community</button>*/}
         {/* <button className="nav-link">About Us</button>*/}
         {/* <button className="nav-link">Contact</button>*/}
        </nav>

        <div className="header-actions">
        {/* <button className="language-btn">EN</button>*/}
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
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

            <Link to="/signup"className="primary-cta">
              Join Your Community
              <ArrowRight size={18} />
            </Link>

            <button className="secondary-cta">
              How it works
            </button>

          </div>

        </div>

      </main>


      

{/* =========================
    FEATURES SECTION
========================= */}

<section className="features-section" id="features">

  {/* SECTION HEADING 
  <div className="features-heading">
    <p className="section-label">WHAT YOU CAN DO</p>

    <h2>Everything your community needs</h2>

    <p className="section-description">
      A simple platform to stay connected, report problems,
      and make your community better together.
    </p>
  </div>
*/}

  {/* FEATURES LIST */}
  <div className="features-list">

    {/* FEATURE 1: REPORT ISSUES */}
    <div className="feature-row">

      <div className="feature-visual" data-number="01">
        <span className="feature-icon">01 / COMMUNITY</span>
        <h3>Report Issues</h3>
        <span className="visual-caption">
          Make a difference in your colony
        </span>
      </div>

      <div className="feature-info">
        <p className="feature-number">01 / REPORTING</p>

        <h3>Make your voice heard</h3>

        <p>
          Report everyday community problems such as potholes,
          garbage, water supply issues, and broken streetlights.
          Keep track of reported issues and help bring attention
          to problems around your colony.
        </p>

        <div className="feature-tags">
          <span>Roads</span>
          <span>Garbage</span>
          <span>Water</span>
          <span>Streetlights</span>
        </div>
      </div>

    </div>


    {/* FEATURE 2: REPORT CRIMES */}
    <div className="feature-row">

      <div className="feature-visual" data-number="02">
        <span className="feature-icon">02 / SAFETY</span>
        <h3>Report Crimes</h3>
        <span className="visual-caption">
          Keep your community informed
        </span>
      </div>

      <div className="feature-info">
        <p className="feature-number">02 / SAFETY</p>

        <h3>Help keep your community informed</h3>

        <p>
          Report crime-related concerns and share important
          information with the appropriate authorities through
          the platform.
        </p>

        <div className="feature-tags">
          <span>Crime Reports</span>
          <span>Community Safety</span>
          <span>Authorities</span>
        </div>
      </div>

    </div>


    {/* FEATURE 3: COMMUNITY UPDATES */}
    <div className="feature-row">

      <div className="feature-visual" data-number="03">
        <span className="feature-icon">03 / COMMUNITY</span>
        <h3>Community Updates</h3>
        <span className="visual-caption">
          Stay connected with your neighbours
        </span>
      </div>

      <div className="feature-info">
        <p className="feature-number">03 / COMMUNITY</p>

        <h3>Stay connected with your neighbours</h3>

        <p>
          Keep up with community announcements, notices,
          festivals, polls, and posts that help residents
          stay connected.
        </p>

        <div className="feature-tags">
          <span>Announcements</span>
          <span>Polls</span>
          <span>Events</span>
        </div>
      </div>

    </div>


    {/* FEATURE 4: COMMUNITY FINANCE */}
    <div className="feature-row">

      <div className="feature-visual" data-number="04">
        <span className="feature-icon">04 / FINANCE</span>
        <h3>Community Finance</h3>
        <span className="visual-caption">
          Keep finances organised
        </span>
      </div>

      <div className="feature-info">
        <p className="feature-number">04 / FINANCE</p>

        <h3>Keep community finances organised</h3>

        <p>
          Access community fee information and expense details
          in one place, helping residents stay informed about
          financial activities.
        </p>

        <div className="feature-tags">
          <span>Fees</span>
          <span>Expenses</span>
          <span>Transparency</span>
        </div>
      </div>

    </div>

  </div>


  {/* BOTTOM CTA */}
  <div className="features-footer">
    <p>
      One community. everything connected.
    </p>

    <a href="/signup" className="features-cta">
      Join SocioSphere <span>→</span>
    </a>
  </div>

</section>

    </div>
  );
}

