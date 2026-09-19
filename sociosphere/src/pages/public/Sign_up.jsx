import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

const SignUp = () => {
  const navigate = useNavigate();
  
  const { login, updateUserProfile } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("citizen");

  const handleSignup = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const password = form.elements.password.value;
    const confirmPassword = form.elements.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const fullName = form.elements.fullName.value.trim();
    const email = form.elements.email.value.trim();
    const colony = form.elements.colony.value;
    const username = form.elements.username?.value.trim() || "";
    const age = form.elements.age?.value || "";
    const occupation =
      form.elements.occupation?.value.trim() || "";
    const department = form.elements.department?.value || "";

    const account = login({
      name: fullName.trim(),
      email: email.trim(),
      username: username.trim(),
      role,
      communityName: colony,
      communityId: colony ? `col-${colony.substring(0, 3).toLowerCase()}` : undefined,
      department,
      age,
      occupation,
    });

    // Save the additional profile information.
    updateUserProfile({
      ...account,
      username: username.trim(),
      age: age,
      occupation: occupation.trim() || department,
      communityName: colony || account.communityName,
    });

    // Temporary navigation until backend authentication is connected.
    if (role === "authority") {
      navigate("/authority/home");
    } else {
      sessionStorage.setItem("sociosphere_show_welcome", "true");
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

      {/* Dark overlay */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#03100b]/95 via-[#061a12]/75 to-[#03100b]/90" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex h-[90px] items-center justify-between px-[7%]">
        <Link to="/" className="flex items-center gap-3">
          <div className="text-4xl">
            <img
              src="/logo_main.png"
              alt="SocioSphere"
              style={{ width: "40px", height: "40px" }}
            />
          </div>

          <div>
            <h2 className="text-[27px] font-bold tracking-tight">
              Socio<span className="text-[#64d984]">Sphere</span>
            </h2>

            <p className="text-[11px] text-white/60">
              One Community. Everything Connected.
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-9">
          {/* Navigation buttons are currently hidden */}
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
            <span className="text-[#62dc85]">your space.</span>
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
          {/* Card heading */}
          <div className="mb-5 text-center">
            <div className="mb-1 flex justify-center">
              <img
                src="/logo_main.png"
                alt="SocioSphere"
                style={{ width: "40px", height: "40px" }}
              />
            </div>

            <h2 className="text-[29px] font-bold">
              Join <span className="text-[#67dc87]">SocioSphere</span>
            </h2>

            <p className="mt-1.5 text-[15px] text-white/60">
              Create your community account.
            </p>
          </div>

          {/* ROLE SELECTION */}
          <div className="mb-5">
            <p className="mb-2 text-center text-base font-semibold text-white/80">
              Who are you?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Citizen */}
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
                  <p className="text-base font-semibold">
                    Normal Citizen
                  </p>

                  <p className="text-[12px] text-white/50">
                    Community member
                  </p>
                </div>
              </button>

              {/* Authority */}
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
                  <p className="text-base font-semibold">
                    Authority
                  </p>

                  <p className="text-[12px] text-white/50">
                    Official account
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSignup}
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
                  />

                  <Input
                    icon={<User size={19} />}
                    placeholder="Username"
                    name="username"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    icon={<Mail size={19} />}
                    placeholder="Email Address"
                    type="email"
                    name="email"
                  />

                  <Input
                    icon={<Calendar size={19} />}
                    placeholder="Age"
                    type="number"
                    name="age"
                    min="1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    icon={<Briefcase size={19} />}
                    placeholder="Job / Occupation"
                    name="occupation"
                  />

                  <ColonySelect />
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
                />

                <Input
                  icon={<Mail size={19} />}
                  placeholder="Official Email Address"
                  type="email"
                  name="email"
                />

                <div className="grid grid-cols-2 gap-3">
                  {/* Department */}
                  <div className="flex h-12 items-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 transition focus-within:border-[#69dc87]">
                    <Building2
                      size={19}
                      className="shrink-0 text-[#79d995]"
                    />

                    <select
                      name="department"
                      defaultValue=""
                      required
                      className="w-full cursor-pointer appearance-none bg-transparent text-base text-white outline-none"
                    >
                      <option
                        value=""
                        disabled
                        className="bg-[#10271e]"
                      >
                        Department
                      </option>

                      <option
                        value="Municipal Corporation"
                        className="bg-[#10271e]"
                      >
                        Municipal Corporation
                      </option>

                      <option
                        value="Police"
                        className="bg-[#10271e]"
                      >
                        Police
                      </option>

                      <option
                        value="Public Works"
                        className="bg-[#10271e]"
                      >
                        Public Works
                      </option>

                      <option
                        value="Health Department"
                        className="bg-[#10271e]"
                      >
                        Health Department
                      </option>

                      <option
                        value="Other"
                        className="bg-[#10271e]"
                      >
                        Other
                      </option>
                    </select>
                  </div>

                  <ColonySelect />
                </div>
              </>
            )}

            {/* PASSWORD */}
            <PasswordInput
              placeholder="Password"
              name="password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            {/* CONFIRM PASSWORD */}
            <PasswordInput
              placeholder="Confirm Password"
              name="confirmPassword"
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
            />

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="mt-2 flex h-[50px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#55ca76] to-[#72df8f] text-[17px] font-bold text-[#062014] shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:shadow-green-500/30"
            >
              Create Account

              <span className="text-[22px]">→</span>
            </button>
          </form>

          {/* ALREADY HAVE ACCOUNT */}
          <div className="mt-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />

            <p className="whitespace-nowrap text-[15px] text-white/60">
              Already have an account?

              <Link
                to="/login"
                className="ml-1 font-semibold text-[#6ce18a] hover:underline"
              >
                Login
              </Link>
            </p>

            <span className="h-px flex-1 bg-white/15" />
          </div>
        </section>
      </main>
    </div>
  );
};

/* ==============================
   FEATURE COMPONENT
   ============================== */

const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#63dc85]/30 bg-[#53be69]/10 text-[#70e58e]">
        {icon}
      </div>

      <div>
        <h3 className="text-base font-semibold">{title}</h3>

        <p className="text-[13px] text-white/60">
          {description}
        </p>
      </div>
    </div>
  );
};

/* ==============================
   COLONY SELECT
   ============================== */

const ColonySelect = () => {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 transition focus-within:border-[#69dc87]">
      <MapPin
        size={19}
        className="shrink-0 text-[#79d995]"
      />

      <select
        name="colony"
        defaultValue=""
        required
        className="w-full cursor-pointer appearance-none bg-transparent text-base text-white outline-none"
      >
        <option
          value=""
          disabled
          className="bg-[#10271e]"
        >
          Select Colony
        </option>

        <option
          value="Gandhi colony"
          className="bg-[#10271e]"
        >
          Gandhi colony
        </option>

        <option
          value="sham nager"
          className="bg-[#10271e]"
        >
          sham nager
        </option>

        <option
          value="Sheetal colony"
          className="bg-[#10271e]"
        >
          Sheetal colony
        </option>

        <option
          value="Dalima vihar"
          className="bg-[#10271e]"
        >
          Dalima vihar
        </option>

        <option
          value="Other"
          className="bg-[#10271e]"
        >
          Other
        </option>
      </select>
    </div>
  );
};

/* ==============================
   NORMAL INPUT
   ============================== */

const Input = ({
  icon,
  placeholder,
  type = "text",
  name,
  min,
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
        min={min}
        required
        className="w-full bg-transparent text-base text-white outline-none placeholder:text-[15px] placeholder:text-white/55"
      />
    </div>
  );
};

/* ==============================
   PASSWORD INPUT
   ============================== */

const PasswordInput = ({
  placeholder,
  name,
  showPassword,
  setShowPassword,
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
        required
        className="w-full bg-transparent text-base text-white outline-none placeholder:text-[15px] placeholder:text-white/55"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-white/50 transition hover:text-[#72df8e]"
        aria-label={
          showPassword ? "Hide password" : "Show password"
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

export default SignUp;