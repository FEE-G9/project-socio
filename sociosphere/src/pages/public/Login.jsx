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
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

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

  const handleQuickLogin = (email, pass = "") => {
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                Quick Multi-Society Demo Logins:
              </span>
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition"
              >
                {showDemoAccounts ? "Hide All Passwords" : "View All 3 Societies"}
              </button>
            </div>

            {/* Quick Admins */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@sociosphere.io", "Admin@GC101")}
                className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-1.5 text-center text-emerald-300 font-bold transition truncate"
                title="Gandhi Colony Admin (Pass: Admin@GC101)"
              >
                Gandhi Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin.shayam@sociosphere.io", "Admin@SN202")}
                className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-1.5 text-center text-emerald-300 font-bold transition truncate"
                title="Shayam Nagar Admin (Pass: Admin@SN202)"
              >
                Shayam Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin.dalima@sociosphere.io", "Admin@DV303")}
                className="rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-1.5 text-center text-emerald-300 font-bold transition truncate"
                title="Dalima Vihar Admin (Pass: Admin@DV303)"
              >
                Dalima Admin
              </button>
            </div>

            {/* Quick Residents (Human Passwords) */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px] mt-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin("aarav@sociosphere.io", "Aarav@402!")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-blue-300 font-medium transition truncate"
                title="Aarav Sharma - Gandhi Colony (Pass: Aarav@402!)"
              >
                Aarav (Gandhi)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("kabir.v@techcorp.in", "KabirV@703#")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-blue-300 font-medium transition truncate"
                title="Kabir Verma - Shayam Nagar (Pass: KabirV@703#)"
              >
                Kabir (Shayam)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("vikram.r@gmail.com", "Vikram#P1#")}
                className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 text-center text-blue-300 font-medium transition truncate"
                title="Vikramaditya - Dalima Vihar (Pass: Vikram#P1#)"
              >
                Vikram (Dalima)
              </button>
            </div>

            {/* EXPANDABLE ALL ACCOUNTS & PASSWORDS CHEATSHEET */}
            {showDemoAccounts && (
              <div className="mt-2.5 p-2 rounded-xl bg-slate-900/90 border border-white/10 text-[10px] max-h-48 overflow-y-auto space-y-2">
                <div>
                  <div className="font-bold text-emerald-400 mb-1 border-b border-white/10 pb-0.5">
                    Gandhi Colony (GC-101)
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("rajesh.k@sociosphere.io", "Rajesh#1982")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Rajesh Khanna (General Secretary) - Rajesh#1982"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Rajesh (Secy)</span>
                      <span className="text-amber-400 font-mono text-[9px]">Rajesh#1982</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("meenakshi.s@sociosphere.io", "Meena@302#")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Meenakshi (Treasurer) - Meena@302#"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Meena (Treas)</span>
                      <span className="text-amber-400 font-mono text-[9px]">Meena@302#</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("priya.p@gmail.com", "Priya#1993")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Priya Patel (Flat 304) - Priya#1993"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Priya Patel</span>
                      <span className="text-amber-400 font-mono text-[9px]">Priya#1993</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("arjun.n@gmail.com", "ArjunN#123")}
                      className="text-left p-1 rounded hover:bg-amber-500/20 border border-amber-500/30 truncate"
                      title="Arjun Nambiar (Pending Approval) - ArjunN#123"
                    >
                      <span className="text-amber-300 font-semibold block truncate">Arjun (Pending)</span>
                      <span className="text-amber-400 font-mono text-[9px]">ArjunN#123</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-sky-400 mb-1 border-b border-white/10 pb-0.5">
                    Shayam Nagar (SN-202)
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("harish.b@sociosphere.io", "Batra@1980")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Harish Batra (Infra) - Batra@1980"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Harish Batra</span>
                      <span className="text-amber-400 font-mono text-[9px]">Batra@1980</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("ananya.sen@sociosphere.io", "DrAnanya@504")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Dr. Ananya Sen (Health) - DrAnanya@504"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Dr. Ananya</span>
                      <span className="text-amber-400 font-mono text-[9px]">DrAnanya@504</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("fatima.s@gmail.com", "Fatima@1998!")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Fatima Sheikh (Flat 102) - Fatima@1998!"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Fatima Sheikh</span>
                      <span className="text-amber-400 font-mono text-[9px]">Fatima@1998!</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("deepak.c@gmail.com", "Chopra@202#")}
                      className="text-left p-1 rounded hover:bg-amber-500/20 border border-amber-500/30 truncate"
                      title="Deepak Chopra (Pending Approval) - Chopra@202#"
                    >
                      <span className="text-amber-300 font-semibold block truncate">Deepak (Pending)</span>
                      <span className="text-amber-400 font-mono text-[9px]">Chopra@202#</span>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-purple-400 mb-1 border-b border-white/10 pb-0.5">
                    Dalima Vihar (DV-303)
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("shalini.m@sociosphere.io", "Shalini@1983")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Shalini Murthy (Secy) - Shalini@1983"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Shalini (Secy)</span>
                      <span className="text-amber-400 font-mono text-[9px]">Shalini@1983</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("neha.k@designstudio.co", "NehaK@2000")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Neha Kapoor (Flat 204) - NehaK@2000"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Neha Kapoor</span>
                      <span className="text-amber-400 font-mono text-[9px]">NehaK@2000</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("tariq.m@yahoo.com", "Tariq@401#")}
                      className="text-left p-1 rounded hover:bg-white/10 truncate"
                      title="Tariq Mansoor (Flat 401) - Tariq@401#"
                    >
                      <span className="text-slate-200 font-semibold block truncate">Tariq Mansoor</span>
                      <span className="text-amber-400 font-mono text-[9px]">Tariq@401#</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("deepa.c@yahoo.com", "DeepaC@1989")}
                      className="text-left p-1 rounded hover:bg-amber-500/20 border border-amber-500/30 truncate"
                      title="Deepa Chawla (Pending Approval) - DeepaC@1989"
                    >
                      <span className="text-amber-300 font-semibold block truncate">Deepa (Pending)</span>
                      <span className="text-amber-400 font-mono text-[9px]">DeepaC@1989</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
