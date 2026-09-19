import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    const enteredUsername = username.trim();
    const accountEmail = enteredUsername.includes("@")
      ? enteredUsername.toLowerCase()
      : enteredUsername
        ? `${enteredUsername.toLowerCase().replace(/\s+/g, ".")}@sociosphere.local`
        : "resident@sociosphere.io";

    const isAuthority =
      enteredUsername.toLowerCase().includes("admin") ||
      enteredUsername.toLowerCase().includes("authority");

    const role = isAuthority ? "authority" : "citizen";

    login({
      name: enteredUsername || (isAuthority ? "Authority Administrator" : "Resident Citizen"),
      email: accountEmail,
      role: role,
    });

    if (isAuthority) {
      navigate("/authority/dashboard");
    } else {
      sessionStorage.setItem("sociosphere_show_welcome", "true");
      navigate("/citizen/home");
    }
  };

  return (
    <div className="login-page">

      {/* Background Video */}
      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/bg-animated.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="overlay"></div>


      {/* Navbar */}
      <nav className="navbar">

        <Link to="/" className="logo-container">

          <img
            src="/logo_main.png"
            alt="SocioSphere"
          />

          <span className="logo-text">
            Socio<span>Sphere</span>
          </span>

        </Link>

      </nav>


      {/* Login Card */}
      <main className="login-container">

        <div className="login-card">

          {/* Logo */}
          <img
            src="/logo_main.png"
            alt="SocioSphere"
            className="card-logo"
          />

          <h1>
            Socio<span>Sphere</span>
          </h1>

          <p className="tagline">
            One Community. Everything Connected.
          </p>


          {/* Login Heading */}
          <h2>Login</h2>

          <p className="welcome">
            Welcome back! Please enter your details
            <br />
            to continue.
          </p>

          <form onSubmit={handleLogin}>
            {/* Username */}
            <div className="input-box">

              <span className="input-icon">👤</span>

              <input
                type="text"
                placeholder="Username / Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

            </div>


            {/* Password */}
            <div className="input-box">

              <span className="input-icon">🔒</span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>

            </div>


            {/* Remember + Forgot */}
            <div className="login-options">

              <label>

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <span>
                  Remember me
                </span>

              </label>

              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>

            </div>


            {/* Login Button */}
            <button type="submit" className="login-btn">
              Login
              <span>→</span>
            </button>
          </form>


          {/* Divider */}
          <div className="divider">

            <span></span>

            <p>OR</p>

            <span></span>

          </div>


          {/* Create Account */}
          <p className="signup-text">

            Don't have an account?

            <Link to="/signup">
              Create an account →
            </Link>

          </p>

        </div>

      </main>

    </div>
  );
}

export default Login;
