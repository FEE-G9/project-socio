import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
	AlertTriangle,
	ArrowLeft,
	Camera,
	CheckCircle2,
	ChevronDown,
	Clock,
	Crosshair,
	FileText,
	ImagePlus,
	MapPin,
	Send,
	ShieldCheck,
	Sparkles,
	X,
} from "lucide-react";

const categories = [
	{ label: "Roads & pathways", value: "roads" },
	{ label: "Water & drainage", value: "water" },
	{ label: "Architecture damage", value: "architecture" },
	{ label: "Waste management", value: "waste" },
	{ label: "Animal Intervention", value: "animals" },
	{ label: "Human Intervention", value: "humans" },
	{ label: "Other community issue", value: "other" },
];

const priorityOptions = [
	{ label: "Low", value: "LOW PRIORITY", class: "low", active: "border-blue-500 bg-blue-500/15 text-blue-400 font-bold" },
	{ label: "Medium", value: "MEDIUM PRIORITY", class: "medium", active: "border-amber-500 bg-amber-500/15 text-amber-400 font-bold" },
	{ label: "High", value: "HIGH PRIORITY", class: "high", active: "border-orange-500 bg-orange-500/15 text-orange-400 font-bold" },
	{ label: "Critical", value: "CRITICAL PRIORITY", class: "critical", active: "border-rose-500 bg-rose-500/15 text-rose-400 font-bold" },
];

const headingStyle = "mb-2 block text-xs font-bold uppercase tracking-wide text-slate-300";

export default function Report({ onClose, isEmbedded = false, onSuccess }) {
	const { theme } = useTheme();
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [priority, setPriority] = useState("MEDIUM PRIORITY");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("Greenwood Heights, Sector 4");
	const [photoName, setPhotoName] = useState("");
	const [photoUrl, setPhotoUrl] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [submittedIssue, setSubmittedIssue] = useState(null);

	const canSubmit = title.trim() && category && description.trim() && location.trim();

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

		const priorityObj = priorityOptions.find((p) => p.value === priority) || priorityOptions[1];
		const categoryObj = categories.find((c) => c.value === category);

		const newIssue = {
			id: `ISSUE-${Math.floor(1000 + Math.random() * 9000)}`,
			title: title.trim(),
			category: categoryObj ? categoryObj.label : category,
			categoryValue: category,
			description: description.trim(),
			location: location.trim(),
			priority: priority,
			priorityClass: priorityObj.class,
			status: "In Progress",
			statusClass: "progress",
			date: `${dateString}, ${timeString}`,
			time: timeString,
			rawDate: dateString,
			timestamp: now.toISOString(),
			eta: "Pending Dispatch",
			photoName: photoName || null,
			image: photoUrl || null,
		};

		// Save to localStorage so Home.jsx can read user-submitted issues later
		try {
			const stored = JSON.parse(localStorage.getItem("sociosphere_user_reports") || "[]");
			localStorage.setItem("sociosphere_user_reports", JSON.stringify([newIssue, ...stored]));
		} catch (e) {
			console.error("Failed to save report to localStorage:", e);
		}

		setSubmittedIssue(newIssue);
		setSubmitted(true);

		if (onSuccess) {
			onSuccess(newIssue);
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			setPhotoName(file.name);
			const reader = new FileReader();
			reader.onload = (e) => {
				setPhotoUrl(e.target.result);
			};
			reader.readAsDataURL(file);
		} else {
			setPhotoName("");
			setPhotoUrl("");
		}
	};

	const resetForm = () => {
		setTitle("");
		setCategory("");
		setPriority("MEDIUM PRIORITY");
		setDescription("");
		setPhotoName("");
		setPhotoUrl("");
		setSubmitted(false);
		setSubmittedIssue(null);
	};

	if (submitted && submittedIssue) {
		return (
			<main className={`${theme === "light" ? "theme-light" : "theme-dark"} ${isEmbedded ? "p-2" : "min-h-screen bg-[#070B14] px-4 py-6"} text-[#F8FAFC] sm:px-6 lg:px-8`}>
				<div className={`mx-auto flex ${isEmbedded ? "min-h-auto" : "min-h-[calc(100vh-3rem)]"} max-w-3xl items-center justify-center`}>
					<section className="w-full rounded-2xl border border-slate-800 bg-[#0D1524] p-6 text-center sm:p-10">
						<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
							<CheckCircle2 size={34} strokeWidth={1.8} />
						</div>
						<p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
							Report submitted & recorded
						</p>
						<h1 className="mb-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
							Thank you for helping your community.
						</h1>
						<p className="mx-auto mb-6 max-w-md text-sm leading-6 text-slate-400">
							Your issue has been saved to your reported items list with timestamp and tracking details.
						</p>

						{/* Submitted Card Summary */}
						<div className="mx-auto mb-8 max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-left">
							<div className="mb-2 flex items-center justify-between text-xs text-slate-400">
								<span className="font-mono font-bold text-emerald-400">{submittedIssue.id}</span>
								<span className="flex items-center gap-1"><Clock size={13} /> {submittedIssue.date}</span>
							</div>
							<h3 className="mb-1 text-base font-bold text-slate-100">{submittedIssue.title}</h3>
							<p className="mb-3 text-xs text-slate-400 line-clamp-2">{submittedIssue.description}</p>
							<div className="flex flex-wrap gap-2 text-xs">
								<span className="rounded-md bg-slate-800 px-2 py-1 text-slate-300">{submittedIssue.category}</span>
								<span className="rounded-md bg-amber-500/15 px-2 py-1 font-semibold text-amber-300">{submittedIssue.priority}</span>
								<span className="rounded-md bg-blue-500/15 px-2 py-1 font-semibold text-blue-300">{submittedIssue.location}</span>
							</div>
						</div>

						<div className="flex flex-wrap justify-center gap-3">
							<button
								type="button"
								onClick={resetForm}
								className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-emerald-400"
							>
								<FileText size={17} />
								Submit another report
							</button>
							{onClose && (
								<button
									type="button"
									onClick={onClose}
									className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-bold text-slate-200 transition-all duration-200 hover:bg-slate-700"
								>
									Back to Dashboard
								</button>
							)}
						</div>
					</section>
				</div>
			</main>
		);
	}

	return (
		<main className={`${theme === "light" ? "theme-light" : "theme-dark"} ${isEmbedded ? "p-0" : "min-h-screen bg-[#070B14]"} text-[#F8FAFC]`}>
			{!isEmbedded && (
				<header className="border-b border-slate-800/80 bg-[#080E1A]">
					<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
						<button
							type="button"
							className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:text-emerald-400"
							onClick={() => (onClose ? onClose() : window.history.back())}
						>
							<ArrowLeft size={18} />
							Back to dashboard
						</button>
						<div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-400 sm:flex">
							<ShieldCheck size={17} />
							Citizen services
						</div>
					</div>
				</header>
			)}

			<div className={`mx-auto max-w-7xl ${isEmbedded ? "p-2" : "px-4 py-8 sm:px-6 sm:py-10 lg:px-8"}`}>
				<div className="mb-8 max-w-2xl">
					<p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
						Community care
					</p>
					<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
						Report an issue
					</h1>
					<p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
						Help your neighbors | act fast | Share what happened and where it needs attention.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
					<form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-[#0D1524] p-5 sm:p-8">
						<div className="mb-8 flex items-start gap-4 border-b border-slate-800 pb-6">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
								<AlertTriangle size={22} />
							</div>
							<div>
								<h2 className="text-lg font-bold">Tell us what needs fixing</h2>
								<p className="mt-1 text-sm text-slate-400">Write as a member, Fix as a community...</p>
							</div>
						</div>

						<div className="space-y-6">
							{/* Title Field */}
							<label className="block">
								<span className={headingStyle}>Issue Title <span className="text-rose-400">*</span></span>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="e.g. Major Water Leakage near Basement P2 Entrance"
									className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-500"
									required
								/>
							</label>

							{/* Category & Priority Grid */}
							<div className="grid gap-6 sm:grid-cols-2">
								<label className="block">
									<span className={headingStyle}>Issue category <span className="text-rose-400">*</span></span>
									<span className="relative block">
										<select
											value={category}
											onChange={(event) => setCategory(event.target.value)}
											className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
										>
											<option value="">Select an issue type</option>
											{categories.map((item) => (
												<option key={item.value} value={item.value}>{item.label}</option>
											))}
										</select>
										<ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
									</span>
								</label>

								<div className="block">
									<span className={headingStyle}>Priority Level <span className="text-rose-400">*</span></span>
									<div className="grid grid-cols-2 gap-2">
										{priorityOptions.map((p) => (
											<button
												key={p.value}
												type="button"
												onClick={() => setPriority(p.value)}
												className={`rounded-xl border py-2.5 px-2 text-center text-xs tracking-wide transition-all ${
													priority === p.value
														? p.active
														: "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200"
												}`}
											>
												{p.label}
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Description Field */}
							<label className="block">
								<span className={headingStyle}>Description <span className="text-rose-400">*</span></span>
								<textarea
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									placeholder="Describe the issue, its impact, and anything your community team should know..."
									rows="4"
									maxLength={1000}
									className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
								/>
								<span className="mt-2 block text-right text-xs text-slate-500">{description.length}/1000</span>
							</label>

							{/* Location Field */}
							<label className="block">
								<span className={headingStyle}>Location <span className="text-rose-400">*</span></span>
								<span className="relative block">
									<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
									<input
										value={location}
										onChange={(event) => setLocation(event.target.value)}
										className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
									/>
									<button
										type="button"
										aria-label="Use current location"
										className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-blue-400"
									>
										<Crosshair size={17} />
									</button>
								</span>
							</label>

							{/* Photo Upload */}
							<div>
								<span className={headingStyle}>Add a photo <span className="font-normal normal-case tracking-normal text-slate-500">(optional)</span></span>
								{photoUrl ? (
									<div className="relative rounded-xl border border-emerald-500/40 bg-slate-900 p-2">
										<div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-950">
											<img src={photoUrl} alt="Issue preview" className="h-full w-full object-cover" />
											<button
												type="button"
												onClick={() => {
													setPhotoName("");
													setPhotoUrl("");
												}}
												className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 text-slate-300 transition-colors hover:bg-rose-600 hover:text-white"
												title="Remove photo"
											>
												<X size={16} />
											</button>
										</div>
										<div className="mt-2 flex items-center justify-between px-1 text-xs text-slate-400">
											<span className="truncate font-mono">{photoName}</span>
											<span className="font-semibold text-emerald-400">Image Loaded</span>
										</div>
									</div>
								) : (
									<label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-4 transition-colors duration-200 hover:border-emerald-500/60 hover:bg-slate-900">
										<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300"><ImagePlus size={19} /></span>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-semibold text-slate-200">{photoName || "Upload an image of the issue"}</span>
											<span className="mt-1 block text-xs text-slate-500">JPG or PNG, up to 10 MB</span>
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
						</div>

						{/* Footer submit & metadata indicator */}
						<div className="mt-8 flex flex-col-reverse gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1">
								<p className="flex items-center gap-2 text-xs leading-5 text-slate-400">
									<Sparkles size={15} className="shrink-0 text-purple-400" /> AI will auto-categorize and route your report.
								</p>
								<p className="flex items-center gap-2 text-[11px] text-slate-500">
									<Clock size={13} className="shrink-0 text-emerald-400" /> Submission date & time will be automatically logged.
								</p>
							</div>
							<button
								type="submit"
								disabled={!canSubmit}
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 shrink-0"
							>
								<Send size={17} /> Submit Report
							</button>
						</div>
					</form>

					{/* Sidebar instructions */}
					<aside className="space-y-4">
						<section className="rounded-2xl border border-blue-500/20 bg-[#0D1524] p-5">
							<div className="mb-4 flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
									<ShieldCheck size={19} />
								</div>
								<h2 className="text-sm font-bold">What happens next?</h2>
							</div>
							<ol className="space-y-4 text-sm text-slate-400">
								<li className="flex gap-3">
									<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">1</span>
									<span>Your issue is saved to your personal reported issues log with date & priority.</span>
								</li>
								<li className="flex gap-3">
									<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">2</span>
									<span>Our team reviews and verifies the issue details.</span>
								</li>
								<li className="flex gap-3">
									<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">3</span>
									<span>It is routed to the right community team for immediate action.</span>
								</li>
							</ol>
						</section>
						<section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
							<div className="flex gap-3">
								<AlertTriangle size={18} className="shrink-0 text-amber-400" />
								<div>
									<h2 className="text-sm font-bold text-amber-300">Emergency?</h2>
									<p className="mt-1 text-xs leading-5 text-slate-400">For immediate danger or a crime in progress, use the emergency service instead.</p>
								</div>
							</div>
						</section>
					</aside>
				</div>
			</div>
		</main>
	);
}

