import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Users,
  MessageCircle,
  Bell,
  HeartHandshake,
  ShieldCheck,
  Building2,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("citizen");

  const handleLogin = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const name = formData.get("fullName");
    const email = formData.get("email");
    const communityId = formData.get("communityId");

    login({
      name,
      email,
      role,
      communityId,
      unitNumber:
        role === "authority"
          ? "HQ Office"
          : "Block B - 201",
    });

    if (role === "authority") {
      navigate("/authority");
    } else {
      navigate("/citizen/home");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071410] text-white">
      {/* BACKGROUND VIDEO */}
      <video
        className="fixed inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/bg-animated.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#03100b]/95 via-[#061a12]/75 to-[#03100b]/90" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex h-[90px] items-center justify-between px-[7%]">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="SocioSphere"
            className="h-12 w-auto object-contain"
          />

          <div>
            <h2 className="text-[27px] font-bold tracking-tight">
              Socio<span className="text-[#64d984]">Sphere</span>
            </h2>

            <p className="text-[11px] text-white/60">
              One Community. Everything Connected.
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex items-center gap-9">
          <a
            href="/"
            className="text-sm text-white/75 transition hover:text-[#6be08a]"
          >
            Home
          </a>

          <a
            href="#"
            className="text-sm text-white/75 transition hover:text-[#6be08a]"
          >
            About
          </a>

          <a
            href="#"
            className="text-sm text-white/75 transition hover:text-[#6be08a]"
          >
            Contact
          </a>

          <button
            type="button"
            className="rounded-full border border-[#7de794]/60 bg-transparent px-7 py-2.5 text-sm transition hover:bg-[#64d984] hover:text-[#071410]"
          >
            Login
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex min-h-[calc(100vh-90px)] items-center justify-between gap-16 px-[10%] pb-12">
        {/* LEFT SIDE */}
        <section className="max-w-[520px]">
          <div className="mb-6 h-1 w-[75px] rounded-full bg-[#63dc85]" />

          <h1 className="mb-5 text-5xl font-bold leading-[1.05] tracking-tight lg:text-[64px]">
            Your community,
            <br />
            <span className="text-[#62dc85]">
              your space.
            </span>
          </h1>

          <p className="mb-9 max-w-[500px] text-lg leading-relaxed text-white/75">
            Connect, report, share and make your
            neighbourhood a better place — together.
          </p>

          {/* FEATURES */}
          <div className="flex flex-col gap-5">
            <Feature
              icon={<Users size={23} />}
              title="Community Connection"
              description="Stay connected with people around you."
            />

            <Feature
              icon={<MessageCircle size={23} />}
              title="Community Chat"
              description="Talk, share and stay informed."
            />

            <Feature
              icon={<Bell size={23} />}
              title="Reports & Notices"
              description="Report issues and receive important updates."
            />

            <Feature
              icon={<HeartHandshake size={23} />}
              title="Local Services"
              description="Find useful services within your community."
            />
          </div>
        </section>

        {/* SIGNUP CARD */}
        <section className="w-full max-w-[540px] shrink-0 rounded-[20px] border border-[#84e699]/35 bg-[#18382b]/55 p-8 shadow-2xl backdrop-blur-xl">
          {/* CARD HEADING + LOGO */}
          <div className="mb-5 text-center">
            <img
              src="/logo.png"
              alt="SocioSphere"
              className="mx-auto mb-3 h-14 w-auto object-contain"
            />

            <h2 className="text-[27px] font-bold">
              Join{" "}
              <span className="text-[#67dc87]">
                SocioSphere
              </span>
            </h2>

            <p className="mt-1.5 text-[13px] text-white/60">
              Create your community account.
            </p>
          </div>

          {/* ROLE SELECTION */}
          <div className="mb-5">
            <p className="mb-2 text-center text-sm font-semibold text-white/80">
              Who are you?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* CITIZEN */}
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`flex h-[58px] items-center justify-center gap-3 rounded-xl border transition ${
                  role === "citizen"
                    ? "border-[#69dc87] bg-[#55ca76]/20 text-[#7bea98]"
                    : "border-white/20 bg-black/20 text-white/60 hover:border-[#69dc87]/50"
                }`}
              >
                <Users size={21} />

                <div className="text-left">
                  <p className="text-sm font-semibold">
                    Normal Citizen
                  </p>

                  <p className="text-[10px] text-white/50">
                    Community member
                  </p>
                </div>
              </button>

              {/* AUTHORITY */}
              <button
                type="button"
                onClick={() => setRole("authority")}
                className={`flex h-[58px] items-center justify-center gap-3 rounded-xl border transition ${
                  role === "authority"
                    ? "border-[#69dc87] bg-[#55ca76]/20 text-[#7bea98]"
                    : "border-white/20 bg-black/20 text-white/60 hover:border-[#69dc87]/50"
                }`}
              >
                <ShieldCheck size={21} />

                <div className="text-left">
                  <p className="text-sm font-semibold">
                    Authority
                  </p>

                  <p className="text-[10px] text-white/50">
                    Official account
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-3"
          >
            {/* CITIZEN FORM */}
            {role === "citizen" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    icon={<User size={19} />}
                    placeholder="Full Name"
                    name="fullName"
                    required
                  />

                  <Input
                    icon={<User size={19} />}
                    placeholder="Username"
                    name="username"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    icon={<Mail size={19} />}
                    placeholder="Email Address"
                    type="email"
                    name="email"
                    required
                  />

                  <Input
                    icon={<Calendar size={19} />}
                    placeholder="Age"
                    type="number"
                    name="age"
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    icon={<Briefcase size={19} />}
                    placeholder="Job / Occupation"
                    name="occupation"
                    required
                  />

                  <ColonySelect
                    name="communityId"
                    required
                  />
                </div>
              </>
            )}

            {/* AUTHORITY FORM */}
            {role === "authority" && (
              <>
                <Input
                  icon={<User size={19} />}
                  placeholder="Full Name"
                  name="fullName"
                  required
                />

                <Input
                  icon={<Mail size={19} />}
                  placeholder="Official Email Address"
                  type="email"
                  name="email"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 transition focus-within:border-[#69dc87]">
                    <Building2
                      size={19}
                      className="shrink-0 text-[#79d995]"
                    />

                    <select
                      name="department"
                      defaultValue=""
                      required
                      className="w-full cursor-pointer appearance-none bg-transparent text-sm text-white outline-none"
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#10271e]"
                      >
                        Department
                      </option>

                      <option
                        value="municipal"
                        className="bg-[#10271e]"
                      >
                        Municipal Corporation
                      </option>

                      <option
                        value="police"
                        className="bg-[#10271e]"
                      >
                        Police
                      </option>

                      <option
                        value="public-works"
                        className="bg-[#10271e]"
                      >
                        Public Works
                      </option>

                      <option
                        value="health"
                        className="bg-[#10271e]"
                      >
                        Health Department
                      </option>

                      <option
                        value="other"
                        className="bg-[#10271e]"
                      >
                        Other
                      </option>
                    </select>
                  </div>

                  <ColonySelect
                    name="communityId"
                    required
                  />
                </div>
              </>
            )}

            {/* PASSWORD */}
            <PasswordInput
              placeholder="Password"
              name="password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              required
            />

            {/* CONFIRM PASSWORD */}
            <PasswordInput
              placeholder="Confirm Password"
              name="confirmPassword"
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              required
            />

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="mt-2 flex h-[50px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#55ca76] to-[#72df8f] text-base font-bold text-[#062014] shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:shadow-green-500/30"
            >
              Create Account

              <span className="text-xl">
                →
              </span>
            </button>
          </form>

          {/* ALREADY ACCOUNT */}
          <div className="mt-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />

            <p className="whitespace-nowrap text-xs text-white/60">
              Already have an account?

              <a
                href="#"
                className="ml-1 font-semibold text-[#6ce18a] hover:underline"
              >
                Login
              </a>
            </p>

            <span className="h-px flex-1 bg-white/15" />
          </div>
        </section>
      </main>
    </div>
  );
};

/* FEATURE COMPONENT */
const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#63dc85]/30 bg-[#53be69]/10 text-[#70e58e]">
        {icon}
      </div>

      <div>
        <h3 className="text-base font-semibold">
          {title}
        </h3>

        <p className="text-[13px] text-white/60">
          {description}
        </p>
      </div>
    </div>
  );
};

/* COLONY SELECT */
const ColonySelect = ({
  name = "communityId",
  required = false,
}) => {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 transition focus-within:border-[#69dc87]">
      <MapPin
        size={19}
        className="shrink-0 text-[#79d995]"
      />

      <select
        name={name}
        defaultValue=""
        required={required}
        className="w-full cursor-pointer appearance-none bg-transparent text-sm text-white outline-none"
      >
        <option
          value=""
          disabled
          className="bg-[#10271e]"
        >
          Select Colony
        </option>

        <option
          value="colony-1"
          className="bg-[#10271e]"
        >
          Green Meadows Heights
        </option>

        <option
          value="colony-2"
          className="bg-[#10271e]"
        >
          Harmony Park Enclave
        </option>

        <option
          value="colony-3"
          className="bg-[#10271e]"
        >
          Sunrise Boulevard Estates
        </option>

        <option
          value="colony-4"
          className="bg-[#10271e]"
        >
          Silver Oak Smart Township
        </option>
      </select>
    </div>
  );
};

/* NORMAL INPUT */
const Input = ({
  icon,
  placeholder,
  type = "text",
  name,
  required = false,
  min,
  max,
}) => {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 transition focus-within:border-[#69dc87] focus-within:bg-[#0c2319]/60">
      <span className="shrink-0 text-[#79d995]">
        {icon}
      </span>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/55"
      />
    </div>
  );
};

/* PASSWORD INPUT */
const PasswordInput = ({
  placeholder,
  name,
  showPassword,
  setShowPassword,
  required = false,
}) => {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 transition focus-within:border-[#69dc87] focus-within:bg-[#0c2319]/60">
      <Lock
        size={19}
        className="shrink-0 text-[#79d995]"
      />

      <input
        type={showPassword ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={6}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/55"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-white/50 transition hover:text-[#72df8e]"
        aria-label={
          showPassword
            ? "Hide password"
            : "Show password"
        }
      >
        {showPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  );
};

export default Login;