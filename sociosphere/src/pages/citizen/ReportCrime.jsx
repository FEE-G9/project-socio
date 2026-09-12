import { useState } from "react";
import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	Camera,
	CheckCircle2,
	ChevronDown,
	Clock,
	Crosshair,
	EyeOff,
	FileText,
	ImagePlus,
	Lock,
	MapPin,
	PhoneCall,
	Send,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	UserX,
	X,
} from "lucide-react";

const crimeCategories = [
	{ label: "Theft & Burglary", value: "theft" },
	{ label: "Vandalism & Property Damage", value: "vandalism" },
	{ label: "Suspicious Activity & Loitering", value: "suspicious" },
	{ label: "Harassment & Assault", value: "harassment" },
	{ label: "Trespassing & Unauthorized Entry", value: "trespassing" },
	{ label: "Vehicle Break-in / Theft", value: "vehicle" },
	{ label: "Noise & Public Nuisance", value: "nuisance" },
	{ label: "Cybercrime & Online Scam", value: "cyber" },
	{ label: "Other Safety / Crime Incident", value: "other" },
];

const severityLevels = [
	{
		id: "critical",
		label: "Critical Threat",
		desc: "Active crime / immediate physical danger",
		badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
	},
	{
		id: "high",
		label: "High Urgency",
		desc: "Occurred recently, suspect nearby",
		badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
	},
	{
		id: "moderate",
		label: "Moderate / Low",
		desc: "Past incident, no active threat",
		badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
	},
];

const headingClass="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-300";

export default function ReportCrime({ onClose, isEmbedded = false, onSuccess }) {
	const [category, setCategory] = useState("");
	const [severity, setSeverity] = useState("high");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("Sector 4 - Central Promenade"); 
	//Need to change this later to the current colony address
	const [landmark, setLandmark] = useState("");
	const [incidentTime, setIncidentTime] = useState("Just now");
	const [suspectDetails, setSuspectDetails] = useState("");
	const [fileName, setFileName] = useState("");
	const [fileUrl, setFileUrl] = useState("");
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [reporterName, setReporterName] = useState("");
	const [reporterPhone, setReporterPhone] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [reportId, setReportId] = useState("");

	const canSubmit = category && description.trim() && location.trim();

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!canSubmit) return;

		const now = new Date();
		const dateString = now.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		const timeString = now.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

		const randomNum = Math.floor(10000 + Math.random() * 90000);
		const cId = `CRM-2026-${randomNum}`;
		setReportId(cId);

		const categoryObj = crimeCategories.find((c) => c.value === category);
		const categoryLabel = categoryObj ? categoryObj.label : (category || "Crime & Safety");

		const severityMap = {
			critical: { priority: "CRITICAL PRIORITY", class: "critical" },
			high: { priority: "HIGH PRIORITY", class: "high" },
			moderate: { priority: "MEDIUM PRIORITY", class: "medium" },
		};
		const sevInfo = severityMap[severity] || severityMap.high;

		const newCrimeIssue = {
			id: cId,
			title: `${categoryLabel} Incident`,
			category: categoryLabel,
			categoryValue: category,
			description: description.trim(),
			location: location.trim() + (landmark ? ` (${landmark})` : ""),
			priority: sevInfo.priority,
			priorityClass: sevInfo.class,
			status: "In Progress",
			statusClass: "progress",
			date: `${dateString}, ${timeString}`,
			time: timeString,
			rawDate: dateString,
			timestamp: now.toISOString(),
			eta: "Security Dispatched",
			fileName: fileName || null,
			image: fileUrl || null,
		};

		try {
			const stored = JSON.parse(localStorage.getItem("sociosphere_user_reports") || "[]");
			localStorage.setItem("sociosphere_user_reports", JSON.stringify([newCrimeIssue, ...stored]));
		} catch (e) {
			console.error("Failed to save crime report to localStorage:", e);
		}

		setSubmitted(true);

		if (onSuccess) {
			onSuccess(newCrimeIssue);
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			setFileName(file.name);
			const reader = new FileReader();
			reader.onload = (e) => {
				setFileUrl(e.target.result);
			};
			reader.readAsDataURL(file);
		} else {
			setFileName("");
			setFileUrl("");
		}
	};

	if (submitted) {
		return (
			<main className={`${isEmbedded ? "p-2" : "min-h-screen bg-[#070B14] px-4 py-6"} text-[#F8FAFC] sm:px-6 lg:px-8`}>
				<div className={`mx-auto flex ${isEmbedded ? "min-h-auto" : "min-h-[calc(100vh-3rem)]"} max-w-3xl items-center justify-center`}>
					<section className="w-full rounded-2xl border border-slate-800 bg-[#0D1524] p-6 text-center sm:p-12 shadow-2xl">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
							<ShieldAlert size={34} strokeWidth={1.8} />
						</div>
						<div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-400 border border-rose-500/20 mb-4">
							<CheckCircle2 size={14} /> Report Logged • Ref #{reportId}
						</div>
						<h1 className="mb-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
							Crime & Safety Incident Report Submitted
						</h1>
						<p className="mx-auto mb-8 max-w-md text-sm leading-6 text-slate-400">
							Your incident report has been dispatched to the society security desk and logged for law enforcement review.
							{isAnonymous && " Your report was recorded anonymously."}
						</p>

						<div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left text-xs leading-6 text-slate-300 space-y-2">
							<div className="flex justify-between border-b border-slate-800 pb-2">
								<span className="text-slate-500">Incident Category:</span>
								<span className="font-semibold text-slate-200 capitalize">{category}</span>
							</div>
							<div className="flex justify-between border-b border-slate-800 pb-2">
								<span className="text-slate-500">Severity Level:</span>
								<span className="font-semibold text-rose-400 uppercase">{severity}</span>
							</div>
							<div className="flex justify-between border-b border-slate-800 pb-2">
								<span className="text-slate-500">Location:</span>
								<span className="font-semibold text-slate-200">{location}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-slate-500">Reporting Mode:</span>
								<span className="font-semibold text-slate-200">{isAnonymous ? "Anonymous Citizen" : "Verified Resident"}</span>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
							<button
								type="button"
								onClick={() => setSubmitted(false)}
								className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold text-slate-200 border border-slate-700 transition-all duration-200 hover:bg-slate-700"
							>
								<FileText size={17} />
								Submit Another Incident
							</button>
							<button
								type="button"
								onClick={() => (onClose ? onClose() : window.history.back())}
								className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-rose-500 shadow-lg shadow-rose-600/20"
							>
								<ArrowLeft size={17} />
								Return to Dashboard
							</button>
						</div>
					</section>
				</div>
			</main>
		);
	}

	return (
		<main className={`${isEmbedded ? "p-0" : "min-h-screen bg-[#070B14]"} text-[#F8FAFC]`}>
			{/* Header */}
			{!isEmbedded && (
				<header className="border-b border-slate-800/80 bg-[#080E1A] sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
					<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
						<button
							type="button"
							className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:text-rose-400"
							onClick={() => (onClose ? onClose() : window.history.back())}
						>
							<ArrowLeft size={18} />
							Back to dashboard
						</button>
						<div className="flex items-center gap-3">
							<a
								href="tel:112"
								className="inline-flex items-center gap-2 rounded-xl bg-rose-500/15 border border-rose-500/30 px-3.5 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/25 transition-colors"
							>
								<PhoneCall size={14} />
								Emergency Hotline: 112
							</a>
							<div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-400 sm:flex">
								<ShieldAlert size={17} />
								Crime & Safety Portal
							</div>
						</div>
					</div>
				</header>
			)}

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
				{/* Emergency Banner */}
				<aside className="mb-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:p-6 text-rose-200">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex items-start gap-3.5">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
								<AlertCircle size={22} />
							</div>
							<div>
								<h2 className="text-base font-bold text-white">Active Life-Threatening Emergency?</h2>
								<p className="mt-1 text-xs text-rose-200/80 leading-5">
									For crimes in progress, active assault, or immediate physical danger, call national emergency services or security desk immediately.
								</p>
							</div>
						</div>
						<a
							href="tel:112"
							className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-rose-500 shadow-md shadow-rose-600/30"
						>
							<PhoneCall size={15} />
							Call Emergency (112)
						</a>
					</div>
				</aside>

				{/* Title Section */}
				<div className="mb-8 max-w-2xl">
					<p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-rose-400">
						Community Safety & Security
					</p>
					<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
						Report a Crime or Incident
					</h1>
					<p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
						Report illegal activity, suspicious behavior, or safety hazards to dispatch security patrols and inform local authorities.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
					{/* Main Form */}
					<form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-[#0D1524] p-5 sm:p-8">
						<div className="mb-8 flex items-start gap-4 border-b border-slate-800 pb-6">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
								<ShieldAlert size={22} />
							</div>
							<div>
								<h2 className="text-lg font-bold">Incident Details</h2>
								<p className="mt-1 text-sm text-slate-400">Provide accurate information for rapid triage and security dispatch.</p>
							</div>
						</div>

						<div className="space-y-6">
							{/* Category */}
							<label className="block">
								<span className={headingClass}>
									Incident Category <span className="text-rose-400">*</span>
								</span>
								<span className="relative block">
									<select
										value={category}
										onChange={(event) => setCategory(event.target.value)}
										className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
									>
										<option value="">Select crime or incident type</option>
										{crimeCategories.map((item) => (
											<option key={item.value} value={item.value}>
												{item.label}
											</option>
										))}
									</select>
									<ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
								</span>
							</label>

							{/* Severity Level */}
							<div>
								<span className={headingClass}>
									Severity / Threat Level <span className="text-rose-400">*</span>
								</span>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
									{severityLevels.map((lvl) => (
										<button
											key={lvl.id}
											type="button"
											onClick={() => setSeverity(lvl.id)}
											className={`flex flex-col text-left rounded-xl border p-3.5 transition-all duration-200 ${
												severity === lvl.id
													? lvl.badgeClass
													: "border-slate-800 bg-slate-900/60 hover:border-slate-700"
											}`}
										>
											<span className="text-xs font-bold text-slate-200">{lvl.label}</span>
											<span className="mt-1 text-[11px] text-slate-400 leading-4">{lvl.desc}</span>
										</button>
									))}
								</div>
							</div>

							{/* Incident Time & Date */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<label className="block">
									<span className={headingClass}>
										When did this occur?
									</span>
									<span className="relative block">
										<Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
										<input
											type="text"
											value={incidentTime}
											onChange={(e) => setIncidentTime(e.target.value)}
											placeholder="e.g. Just now, Today 2:30 PM"
											className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
										/>
									</span>
								</label>
								<label className="block">
									<span className={headingClass}>
										Specific Landmark / Area
									</span>
									<input
										type="text"
										value={landmark}
										onChange={(e) => setLandmark(e.target.value)}
										placeholder="e.g. Near Gate 3 parking, Block C stairwell"
										className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
									/>
								</label>
							</div>

							{/* Location */}
							{/* 7/09/2026 -> To change the Location to Current colony person is in later */}
							<label className="block">
								<span className={headingClass}>
									Location <span className="text-rose-400">*</span>
								</span>
								<span className="relative block">
									<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
									<input
										value={location}
										onChange={(event) => setLocation(event.target.value)}
										className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
									/>
									<button
										type="button"
										aria-label="Use current location"
										className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-rose-400"
									>
										<Crosshair size={17} />
									</button>
								</span>
							</label>

							{/* Description */}
							<label className="block">
								<span className={headingClass}>
									Detailed Description <span className="text-rose-400">*</span>
								</span>
								<textarea
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									placeholder="Provide exact facts: sequence of events, physical characteristics of persons involved, weapon/vehicle observations, or stolen items..."
									rows="5"
									maxLength={1000}
									className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
								/>
								<span className="mt-2 block text-right text-xs text-slate-500">
									{description.length}/1000
								</span>
							</label>

							{/* Suspect / Vehicle Details */}
							<label className="block">
								<span className={headingClass}>
									Suspect / Vehicle Details <span className="font-normal normal-case text-slate-500">(optional)</span>
								</span>
								<input
									type="text"
									value={suspectDetails}
									onChange={(e) => setSuspectDetails(e.target.value)}
									placeholder="e.g. Tall male in black hoodie, silver SUV reg #AB-123"
									className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
								/>
							</label>

							{/* Evidence / Photo / Video Upload */}
							<div>
								<span className={headingClass}>
									Photo / Video Evidence <span className="font-normal normal-case text-slate-500">(image only)</span>
								</span>
								{fileUrl ? (
									<div className="relative rounded-xl border border-rose-500/40 bg-slate-900 p-2">
										<div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-950">
											<img src={fileUrl} alt="Evidence preview" className="h-full w-full object-cover" />
											<button
												type="button"
												onClick={() => {
													setFileName("");
													setFileUrl("");
												}}
												className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-slate-300 transition-colors hover:bg-rose-600 hover:text-white"
												title="Remove evidence photo"
											>
												<X size={16} />
											</button>
										</div>
										<div className="mt-2 flex items-center justify-between px-1 text-xs text-slate-400">
											<span className="truncate font-mono">{fileName}</span>
											<span className="font-semibold text-rose-400">Evidence Photo Loaded</span>
										</div>
									</div>
								) : (
									<label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-4 transition-colors duration-200 hover:border-rose-500/60 hover:bg-slate-900">
										<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
											<ImagePlus size={19} />
										</span>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-semibold text-slate-200">
												Upload photo of incident or evidence
											</span>
											<span className="mt-1 block text-xs text-slate-500">
												JPG or PNG, up to 10 MB
											</span>
										</span>
										<Camera size={18} className="text-slate-500" />
										<input
											type="file"
											accept="image/*"
											className="sr-only"
											onChange={handleFileChange}
										/>
									</label>
								)}
							</div>

							{/* Anonymous Toggle & Contact Info */}
							<div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
							{/* space-y-4 gives vertical space of 1 rem in child elements */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
											{isAnonymous ? <EyeOff size={18} className="text-purple-400" /> : <Lock size={18} className="text-blue-400" />}
										</div>
										<div>
											<span className="block text-sm font-bold text-slate-200">Submit Anonymously</span>
											<span className="block text-xs text-slate-400">Hide your identity from public records & society feeds</span>
										</div>
									</div>
									<button
										type="button"
										onClick={() => setIsAnonymous(!isAnonymous)}
										className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
											isAnonymous ? "bg-rose-600" : "bg-slate-700"
										}`}
									>
										<span
											className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
												isAnonymous ? "translate-x-4" : "translate-x-0"
											}`}
										/>
									</button>
								</div>

								{!isAnonymous && (
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-800 pt-3">
										<input
											type="text"
											value={reporterName}
											onChange={(e) => setReporterName(e.target.value)}
											placeholder="Your Name (Optional)"
											className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-rose-500"
										/>
										<input
											type="tel"
											value={reporterPhone}
											onChange={(e) => setReporterPhone(e.target.value)}
											placeholder="Contact Phone Number"
											className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-rose-500"
										/>
									</div>
								)}
							</div>
						</div>

						{/* Form Actions */}
						<div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
							<p className="flex items-center gap-2 text-xs leading-5 text-slate-500">
								<Sparkles size={15} className="shrink-0 text-rose-400" />
								AI Auto-Triage will prioritize & route report to security desk.
							</p>
							<button
								type="submit"
								disabled={!canSubmit}
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-rose-600/20"
							>
								<Send size={17}/>
								Submit Crime Report
							</button>
						</div>
					</form>

					{/* Sidebar */}
					<aside className="space-y-4">
						<section className="rounded-2xl border border-rose-500/50 bg-slate-900/85 p-5">
							<div className="mb-4 flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
									<PhoneCall size={19} />
								</div>
								<h2 className="text-sm font-bold text-slate-100">Emergency Contacts</h2>
							</div>
							<div className="space-y-3 text-xs">
								<div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800">
									<div>
										<span className="block font-bold text-slate-200">Main Security Gate</span>
										<span className="text-slate-400">24/7 Security Patrol Desk</span>
									</div>
									<a href="tel:5550192831" className="text-rose-400 font-bold hover:underline">
										Call
									</a>
								</div>
								<div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800">
									<div>
										<span className="block font-bold text-slate-200">Local Police Control</span>
										<span className="text-slate-400">Emergency Dispatch</span>
									</div>
									<a href="tel:112" className="text-rose-400 font-bold hover:underline">
										112
									</a>
								</div>
								<div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800">
									<div>
										<span className="block font-bold text-slate-200">Women & Child Safety</span>
										<span className="text-slate-400">Helpline Service</span>
									</div>
									<a href="tel:1091" className="text-rose-400 font-bold hover:underline">
										1091
									</a>
								</div>
							</div>
						</section>

						<section className="rounded-2xl border border-slate-800 bg-[#0D1524] p-5">
							<div className="mb-3 flex items-center gap-2 text-slate-200 font-bold text-sm">
								<ShieldCheck size={18} className="text-emerald-400" />
								<span>Evidence & Safety Tips</span>
							</div>
							<ul className="space-y-2.5 text-xs text-slate-400 leading-5">
								<li className="flex items-start gap-2">
									<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
									<span>Do not disturb or touch physical evidence at the incident site.</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
									<span>Never attempt to confront suspicious or armed individuals personally.</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
									<span>Note vehicle license numbers and precise direction of travel if safe.</span>
								</li>
							</ul>
						</section>
					</aside>
				</div>
			</div>
		</main>
	);
}
