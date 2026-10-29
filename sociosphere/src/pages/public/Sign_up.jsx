import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../data/mockUsers";
import { getColonies } from "../../data/mockColonies";
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
  Home,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  // Clear any existing session when the sign-up page loads,
  // so the user sees the form rather than being auto-redirected.
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const colonies = getColonies();

  const [role, setRole] = useState("citizen");
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  // Comprehensive Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    colony: "Gandhi Colony",
    occupation: "",
    blockNumber: "Block A",
    houseOrFlatNo: "",
    occupancyType: "Owner",
    department: "Municipal Administration",
    designation: "Executive Board Member",
    password: "",
    confirmPassword: ""
  });

  // Validation Errors
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Full Name is required";
        } else if (value.trim().length < 3) {
          error = "Name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(value.trim())) {
          error = "Name can only contain letters, dots, and spaces";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(value.trim().replace(/\D/g, ""))) {
          error = "Must be a valid 10-digit mobile number";
        }
        break;

      case "age":
        if (!value) {
          error = "Age is required";
        } else {
          const numAge = parseInt(value, 10);
          if (isNaN(numAge) || numAge < 18 || numAge > 100) {
            error = "Age must be between 18 and 100";
          }
        }
        break;

      case "occupation":
        if (!value.trim()) {
          error = "Job / Occupation is required";
        } else if (value.trim().length < 2) {
          error = "Occupation must be at least 2 characters";
        }
        break;

      case "houseOrFlatNo":
        if (!value.trim()) {
          error = "House / Flat number is required";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);

    // Validate on change
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));

    // Recheck confirm password if password changes
    if (name === "password" && formData.confirmPassword) {
      if (value !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validateStep1 = () => {
    const step1Keys = ["fullName", "email", "phone", "age", "occupation"];
    const newErrors = {};
    step1Keys.forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setSubmitError("Please fill in your valid personal details to continue.");
      return false;
    }
    setSubmitError(null);
    return true;
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
      return;
    }

    // Step 2 submission: Validate all fields across both steps
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      // Skip irrelevant fields based on role
      if (role === "authority" && (key === "occupancyType")) return;
      if (role === "citizen" && (key === "department" || key === "designation")) return;

      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    const step1Keys = ["fullName", "email", "phone", "age", "occupation"];
    const hasStep1Error = Object.keys(newErrors).some((k) => step1Keys.includes(k));

    if (hasStep1Error) {
      setErrors(newErrors);
      setCurrentStep(1);
      setSubmitError("Please correct your personal details first.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitError("Please correct the errors in the form before submitting.");
      return;
    }

    // Resolve Colony and Specific Society Code
    const chosenColony = colonies.find((c) => c.name === formData.colony) || colonies[0];
    const societyCode = chosenColony?.code || (
      formData.colony === "Gandhi Colony" ? "GC-101" :
      formData.colony === "Shayam Nagar" ? "SN-202" : "DV-303"
    );

    const isAuthority = role === "authority";

    // Register user in the database
    const result = registerUser({
      name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: `+91 ${formData.phone.trim().replace(/\D/g, "")}`,
      age: parseInt(formData.age, 10),
      society: formData.colony,
      societyCode: societyCode,
      communityName: formData.colony,
      communityId: chosenColony.id,
      occupation: formData.occupation.trim(),
      blockNumber: formData.blockNumber,
      houseOrFlatNo: formData.houseOrFlatNo.trim(),
      unitNumber: `${formData.blockNumber} - ${formData.houseOrFlatNo.trim()}`,
      occupancyType: isAuthority ? "Committee Official" : formData.occupancyType,
      type: isAuthority ? "member" : "resident",
      role: role,
      designation: isAuthority
        ? formData.designation || formData.department
        : `Resident (${formData.occupancyType})`,
      password: formData.password,
      status: "Pending Approval"
    });

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    // Show Society Approval Pending Screen for BOTH Citizen and Authority
    setRegistrationSuccess({
      name: formData.fullName.trim(),
      society: formData.colony,
      societyCode: societyCode,
      block: formData.blockNumber,
      unit: formData.houseOrFlatNo.trim(),
      email: formData.email.trim(),
      role: role,
      designation: isAuthority
        ? formData.designation || formData.department || "Executive Board Member"
        : `Resident (${formData.occupancyType})`
    });
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
      <div className="fixed inset-0 bg-gradient-to-r from-[#03100b]/95 via-[#061a12]/80 to-[#03100b]/90" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex h-[85px] items-center justify-between px-[7%]">
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
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex min-h-[calc(100vh-85px)] items-center justify-between gap-12 px-[8%] pb-12">
        {/* LEFT SIDE BRANDING */}
        <section className="hidden lg:block max-w-[480px]">
          <div className="mb-6 h-1 w-[75px] rounded-full bg-[#63dc85]" />

          <h1 className="mb-5 text-5xl font-bold leading-[1.05] tracking-tight">
            Your community,
            <br />
            <span className="text-[#62dc85]">your space.</span>
          </h1>

          <p className="mb-9 max-w-[450px] text-lg leading-relaxed text-white/75">
            Connect with Gandhi Colony, Shayam Nagar, and Dalima Vihar. Secure, smart, and fully connected civic society living.
          </p>

          <div className="flex flex-col gap-5">
            <Feature
              icon={<Users size={23} />}
              title="Verified Society Residents"
              description="Real residents, flat owners, and authenticated committee members."
            />

            <Feature
              icon={<ShieldCheck size={23} />}
              title="Society Admin Approvals"
              description="New join requests are verified by your designated society RWA desk."
            />

            <Feature
              icon={<Bell size={23} />}
              title="Instant Civic Action"
              description="Real-time issue tracking, emergency SOS, and community announcements."
            />
          </div>
        </section>

        {/* RIGHT SIDE SIGN UP CARD */}
        <section className="w-full max-w-[620px] rounded-3xl border border-white/15 bg-black/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* SUCCESS MODAL / SCREEN */}
          {registrationSuccess ? (
            <div className="py-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={44} />
              </div>

              <span className={`rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider border ${
                registrationSuccess.role === 'authority'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400/40'
                  : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
              }`}>
                {registrationSuccess.role === 'authority' ? 'Administrative Privilege Request Sent' : 'Request Sent to Society Admin'}
              </span>

              <h2 className="mt-3 text-3xl font-black text-white">
                {registrationSuccess.role === 'authority' ? 'Admin Application Queued!' : 'Application Received!'}
              </h2>

              <p className="mt-2 text-sm text-white/80 leading-relaxed max-w-md mx-auto">
                Welcome <strong className="text-white font-bold">{registrationSuccess.name}</strong>! Your application {registrationSuccess.role === 'authority' ? 'for administrative access to' : 'to enter'} <strong className="text-emerald-400 font-bold">{registrationSuccess.society}</strong> ({registrationSuccess.societyCode}) has been dispatched to the society board administration.
              </p>

              {/* DETAILS SUMMARY BOX */}
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Selected Society:</span>
                  <span className="font-bold text-emerald-400">{registrationSuccess.society} ({registrationSuccess.societyCode})</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">{registrationSuccess.role === 'authority' ? 'Authority Role:' : 'Residence Details:'}</span>
                  <span className="font-semibold text-white">
                    {registrationSuccess.role === 'authority' ? registrationSuccess.designation : `${registrationSuccess.block} - ${registrationSuccess.unit}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Registered Email:</span>
                  <span className="font-mono text-white/80">{registrationSuccess.email}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-white/60">Status:</span>
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Clock size={13} />
                    {registrationSuccess.role === 'authority' ? 'Pending Board Verification' : 'Pending RWA Verification'}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-200/90 text-left">
                {registrationSuccess.role === 'authority' 
                  ? '🔒 For colony safety and governance, all administrative credentials must be verified and admitted by the existing RWA Board President before authority portal privileges are activated.'
                  : 'ℹ️ For resident safety, the society admin will verify your flat details before activating full account access.'
                }
              </div>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all"
              >
                <span>Proceed to Login</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <>
              {/* HEADER WITH STEPPER PROGRESS */}
              <div className="mb-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      Create your account
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-white/60">
                      {currentStep === 1 
                        ? "Step 1 of 2: Personal profile & contact details" 
                        : "Step 2 of 2: Society, residence & login credentials"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
                    Step {currentStep} of 2
                  </span>
                </div>

                {/* STEP PILLS NAVIGATOR */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                      currentStep === 1
                        ? "border-[#69dc87] bg-[#55ca76]/20 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      currentStep === 1 ? "bg-[#55ca76] text-slate-950" : "bg-white/15 text-white"
                    }`}>
                      1
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-none truncate">Personal Profile</p>
                      <p className="text-[10px] text-white/50 mt-1 truncate">Name, Email & Phone</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setCurrentStep(2);
                    }}
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                      currentStep === 2
                        ? "border-[#69dc87] bg-[#55ca76]/20 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      currentStep === 2 ? "bg-[#55ca76] text-slate-950" : "bg-white/15 text-white"
                    }`}>
                      2
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-none truncate">Society & Unit</p>
                      <p className="text-[10px] text-white/50 mt-1 truncate">Colony, Unit & Password</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* GENERAL SUBMISSION ERROR BANNER */}
              {submitError && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs font-semibold text-rose-300 animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0 text-rose-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSignup} noValidate>
                {/* ===================================================
                    STEP 1: PERSONAL DETAILS
                =================================================== */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* ROLE TOGGLE */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                        Select Account Type *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setRole("citizen");
                            setSubmitError(null);
                          }}
                          className={`flex h-[52px] items-center justify-center gap-3 rounded-xl border transition ${
                            role === "citizen"
                              ? "border-[#69dc87] bg-[#55ca76]/20 text-[#7bea98]"
                              : "border-white/15 bg-black/20 text-white/60 hover:border-[#69dc87]/50"
                          }`}
                        >
                          <Users size={20} />
                          <div className="text-left">
                            <p className="text-sm font-bold leading-tight">Resident Citizen</p>
                            <p className="text-[11px] text-white/50">Flat owner / Tenant</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRole("authority");
                            setSubmitError(null);
                          }}
                          className={`flex h-[52px] items-center justify-center gap-3 rounded-xl border transition ${
                            role === "authority"
                              ? "border-[#69dc87] bg-[#55ca76]/20 text-[#7bea98]"
                              : "border-white/15 bg-black/20 text-white/60 hover:border-[#69dc87]/50"
                          }`}
                        >
                          <ShieldCheck size={20} />
                          <div className="text-left">
                            <p className="text-sm font-bold leading-tight">Authority / Member</p>
                            <p className="text-[11px] text-white/50">Society official</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* FULL NAME */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1">
                        Full Legal Name *
                      </label>
                      <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition ${
                        errors.fullName ? "border-rose-500 bg-rose-500/10" : "border-white/20 bg-black/20 focus-within:border-[#69dc87]"
                      }`}>
                        <User size={18} className="shrink-0 text-[#79d995]" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Chandra"
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                        />
                      </div>
                      {errors.fullName && <p className="mt-1 text-[11px] text-rose-400 font-semibold">{errors.fullName}</p>}
                    </div>

                    {/* EMAIL & PHONE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Email Address *
                        </label>
                        <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition ${
                          errors.email ? "border-rose-500 bg-rose-500/10" : "border-white/20 bg-black/20 focus-within:border-[#69dc87]"
                        }`}>
                          <Mail size={18} className="shrink-0 text-[#79d995]" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@domain.com"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                          />
                        </div>
                        {errors.email && <p className="mt-1 text-[11px] text-rose-400 font-semibold">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Mobile Number *
                        </label>
                        <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition ${
                          errors.phone ? "border-rose-500 bg-rose-500/10" : "border-white/20 bg-black/20 focus-within:border-[#69dc87]"
                        }`}>
                          <Phone size={18} className="shrink-0 text-[#79d995]" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="10-digit phone (e.g. 9876543210)"
                            maxLength={10}
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                          />
                        </div>
                        {errors.phone && <p className="mt-1 text-[11px] text-rose-400 font-semibold">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* AGE & OCCUPATION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Age (Years) *
                        </label>
                        <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition ${
                          errors.age ? "border-rose-500 bg-rose-500/10" : "border-white/20 bg-black/20 focus-within:border-[#69dc87]"
                        }`}>
                          <Calendar size={18} className="shrink-0 text-[#79d995]" />
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="e.g. 30"
                            min={18}
                            max={100}
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                          />
                        </div>
                        {errors.age && <p className="mt-1 text-[11px] text-rose-400 font-semibold">{errors.age}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Job / Occupation *
                        </label>
                        <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition ${
                          errors.occupation ? "border-rose-500 bg-rose-500/10" : "border-white/20 bg-black/20 focus-within:border-[#69dc87]"
                        }`}>
                          <Briefcase size={18} className="shrink-0 text-[#79d995]" />
                          <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                          />
                        </div>
                        {errors.occupation && <p className="mt-1 text-[11px] text-rose-400 font-semibold">{errors.occupation}</p>}
                      </div>
                    </div>

                    {/* CONTINUE BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setCurrentStep(2);
                      }}
                      className="mt-3 flex h-[50px] w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#55ca76] to-[#72df8f] text-base font-bold text-[#062014] shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:shadow-green-500/30 active:scale-95"
                    >
                      <span>Continue to Society & Residence</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* ===================================================
                    STEP 2: SOCIETY, RESIDENCE & PASSWORDS
                =================================================== */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* SOCIETY SELECTION */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center justify-between">
                        <span>Select Society / Colony *</span>
                        <span className="text-[10px] text-white/50 font-normal">Multi-society database</span>
                      </label>
                      <div className="flex h-11 items-center gap-2.5 rounded-xl border border-white/20 bg-black/20 px-3.5 transition focus-within:border-[#69dc87]">
                        <Building2 size={18} className="shrink-0 text-[#79d995]" />
                        <select
                          name="colony"
                          value={formData.colony}
                          onChange={handleChange}
                          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-white outline-none"
                        >
                          <option value="Gandhi Colony" className="bg-[#10271e]">Gandhi Colony (Code: GC-101)</option>
                          <option value="Shayam Nagar" className="bg-[#10271e]">Shayam Nagar (Code: SN-202)</option>
                          <option value="Dalima Vihar" className="bg-[#10271e]">Dalima Vihar (Code: DV-303)</option>
                        </select>
                      </div>
                    </div>

                    {/* BLOCK & FLAT NUMBER */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Block / Tower *
                        </label>
                        <div className="flex h-11 items-center gap-2.5 rounded-xl border border-white/20 bg-black/20 px-3.5 transition focus-within:border-[#69dc87]">
                          <MapPin size={18} className="shrink-0 text-[#79d995]" />
                          <select
                            name="blockNumber"
                            value={formData.blockNumber}
                            onChange={handleChange}
                            className="w-full cursor-pointer appearance-none bg-transparent text-sm text-white outline-none font-medium"
                          >
                            <option value="Block A" className="bg-[#10271e]">Block A</option>
                            <option value="Block B" className="bg-[#10271e]">Block B</option>
                            <option value="Block C" className="bg-[#10271e]">Block C</option>
                            <option value="Block D" className="bg-[#10271e]">Block D</option>
                            <option value="Tower A" className="bg-[#10271e]">Tower A</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          House or Flat No. *
                        </label>
                        <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition ${
                          errors.houseOrFlatNo ? "border-rose-500 bg-rose-500/10" : "border-white/20 bg-black/20 focus-within:border-[#69dc87]"
                        }`}>
                          <Home size={18} className="shrink-0 text-[#79d995]" />
                          <input
                            type="text"
                            name="houseOrFlatNo"
                            value={formData.houseOrFlatNo}
                            onChange={handleChange}
                            placeholder="e.g. Flat 707"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                          />
                        </div>
                        {errors.houseOrFlatNo && <p className="mt-1 text-[11px] text-rose-400 font-semibold">{errors.houseOrFlatNo}</p>}
                      </div>
                    </div>

                    {/* ROLE SPECIFIC FIELD */}
                    {role === "citizen" ? (
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Residency Status in Colony *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {["Owner", "Tenant"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, occupancyType: type }))}
                              className={`h-10 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                                formData.occupancyType === type
                                  ? "border-[#69dc87] bg-[#55ca76]/20 text-[#7bea98]"
                                  : "border-white/15 bg-black/20 text-white/60 hover:border-white/30"
                              }`}
                            >
                              <span>Flat {type}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Authority Designation *
                        </label>
                        <div className="flex h-11 items-center gap-2.5 rounded-xl border border-white/20 bg-black/20 px-3.5 transition focus-within:border-[#69dc87]">
                          <ShieldCheck size={18} className="shrink-0 text-[#79d995]" />
                          <select
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            className="w-full cursor-pointer appearance-none bg-transparent text-sm text-white outline-none font-medium"
                          >
                            <option value="RWA President" className="bg-[#10271e]">RWA President</option>
                            <option value="General Secretary" className="bg-[#10271e]">General Secretary</option>
                            <option value="Treasurer" className="bg-[#10271e]">Treasurer</option>
                            <option value="Security In-Charge" className="bg-[#10271e]">Security In-Charge</option>
                            <option value="Infrastructure Coordinator" className="bg-[#10271e]">Infrastructure Coordinator</option>
                            <option value="Health & Sanitation Convener" className="bg-[#10271e]">Health & Sanitation Convener</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* PASSWORDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Account Password *
                        </label>
                        <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition ${
                          errors.password ? "border-rose-500 bg-rose-500/10" : "border-white/20 bg-black/20 focus-within:border-[#69dc87]"
                        }`}>
                          <Lock size={18} className="shrink-0 text-[#79d995]" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-white/50 hover:text-white"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.password && <p className="mt-1 text-[11px] text-rose-400 font-semibold">{errors.password}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Confirm Password *
                        </label>
                        <div className={`flex h-11 items-center gap-2.5 rounded-xl border px-3.5 transition ${
                          errors.confirmPassword ? "border-rose-500 bg-rose-500/10" : "border-white/20 bg-black/20 focus-within:border-[#69dc87]"
                        }`}>
                          <Lock size={18} className="shrink-0 text-[#79d995]" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-white/50 hover:text-white"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-[11px] text-rose-400 font-semibold">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    {/* ACTION BUTTONS (BACK & SUBMIT) */}
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex h-[50px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white hover:bg-white/10 transition"
                      >
                        ← Back
                      </button>

                      <button
                        type="submit"
                        className="flex h-[50px] flex-1 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#55ca76] to-[#72df8f] text-base font-bold text-[#062014] shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:shadow-green-500/30 active:scale-95"
                      >
                        <span>{role === "citizen" ? "Request Society Join" : "Create Official Account"}</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* ALREADY HAVE ACCOUNT */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60 border-t border-white/10 pt-4">
                <span>Already registered in your society?</span>
                <Link to="/login" className="font-bold text-[#6ce18a] hover:underline">
                  Sign In →
                </Link>
              </div>
            </>
          )}
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
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#63dc85]/30 bg-[#53be69]/10 text-[#70e58e]">
        {icon}
      </div>

      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-[13px] text-white/60">{description}</p>
      </div>
    </div>
  );
};

export default SignUp;