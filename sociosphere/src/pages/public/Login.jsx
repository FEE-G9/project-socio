import React, { useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authenticateUser } from "../../data/mockUsers";
import { AlertCircle, Clock, CheckCircle2, ChevronRight, Building2 } from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [pendingNotice, setPendingNotice] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setPendingNotice(null);

    const enteredIdentifier = username.trim();
    if (!enteredIdentifier) {
      setErrorMsg("Please enter your email or username.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    // Authenticate against database
    const authResult = authenticateUser(enteredIdentifier, password);

    if (!authResult.success) {
      if (authResult.isPending) {
        setPendingNotice({
          user: authResult.user,
          message: authResult.error
        });
      } else {
        setErrorMsg(authResult.error);
      }
      return;
    }

    const authenticatedUser = authResult.user;
    login(authenticatedUser);

    if (authenticatedUser.role === "authority") {
      navigate("/authority/home");
    } else {
      sessionStorage.setItem("sociosphere_show_welcome", "true");
      navigate("/citizen/home");
    }
  };

  const handleQuickLogin = (email, pass = "password123") => {
    setUsername(email);
    setPassword(pass);
    setErrorMsg(null);
    setPendingNotice(null);
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
            Access your society portal. Enter your verified resident or committee account credentials.
          </p>

          {/* ERROR ALERT BANNER */}
          {errorMsg && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-left text-xs font-semibold text-rose-300 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* PENDING APPROVAL NOTICE BANNER */}
          {pendingNotice && (
            <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/15 p-3.5 text-left text-xs text-amber-200 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <Clock size={15} />
                <span>Account Awaiting Admin Approval</span>
              </div>
              <p className="leading-relaxed">
                {pendingNotice.message}
              </p>
              <div className="mt-2 text-[11px] text-amber-300/80 border-t border-amber-500/20 pt-1.5">
                Unit: {pendingNotice.user?.unitNumber} ({pendingNotice.user?.society})
              </div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Username */}
            <div className="input-box">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="Email or Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg(null);
                  setPendingNotice(null);
                }}
              />
            </div>

            {/* Password */}
            <div className="input-box">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg(null);
                  setPendingNotice(null);
                }}
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
                <span>Remember me</span>
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

          {/* QUICK DEMO CREDENTIALS SHORTCUTS */}
          <div className="mt-4 pt-3 border-t border-white/10 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block mb-2">
              Quick Society Login Demo (Password: password123):
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@sociosphere.io")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-emerald-400 font-bold transition truncate"
                title="Gandhi Colony Admin"
              >
                Gandhi Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin.shayam@sociosphere.io")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-emerald-400 font-bold transition truncate"
                title="Shayam Nagar Admin"
              >
                Shayam Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin.dalima@sociosphere.io")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-emerald-400 font-bold transition truncate"
                title="Dalima Vihar Admin"
              >
                Dalima Admin
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] mt-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin("aarav@sociosphere.io")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-blue-300 font-medium transition truncate"
                title="Gandhi Colony Resident"
              >
                Gandhi Resident
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("kabir.v@techcorp.in")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-blue-300 font-medium transition truncate"
                title="Shayam Nagar Resident"
              >
                Shayam Resident
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("vikram.r@gmail.com")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-blue-300 font-medium transition truncate"
                title="Dalima Vihar Resident"
              >
                Dalima Resident
              </button>
            </div>
          </div>

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
