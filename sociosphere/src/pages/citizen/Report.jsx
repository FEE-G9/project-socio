import { useState } from "react";
import {
	AlertTriangle,
	ArrowLeft,
	Camera,
	CheckCircle2,
	ChevronDown,
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

export default function Report() {
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("Greenwood Heights, Sector 4");
	const [photoName, setPhotoName] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const canSubmit = category && description.trim() && location.trim();

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!canSubmit) return;
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<main className="min-h-screen bg-[#070B14] px-4 py-6 text-[#F8FAFC] sm:px-6 lg:px-8">
				<div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
					<section className="w-full rounded-2xl border border-slate-800 bg-[#0D1524] p-6 text-center sm:p-12">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
							<CheckCircle2 size={34} strokeWidth={1.8} /> {/*The green tick circle*/}
						</div>
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
							Report submitted
						</p>
						<h1 className="mb-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
							Thank you for helping your community.
						</h1>
						<p className="mx-auto mb-8 max-w-md text-sm leading-6 text-slate-400">
							Your report has been added to the community queue. You can track
							updates from your reported issues.
						</p>
						<button
							type="button"
							onClick={() => setSubmitted(false)}
							className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-emerald-400"
						>
							<FileText size={17} />
							Submit another report
						</button>
					</section>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-[#070B14] text-[#F8FAFC]">
			<header className="border-b border-slate-800/80 bg-[#080E1A]">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
					<button
						type="button"
						className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:text-emerald-400"
						onClick={() => window.history.back()}
					>
						<ArrowLeft size={18} /> {/*The arrow left one */}
						Back to dashboard
					</button>
					<div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-400 sm:flex">
						<ShieldCheck size={17} />
						Citizen services
					</div>
				</div>
			</header>

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
				<div className="mb-8 max-w-2xl">
					<p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
						Community care
					</p>
					<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
						Report an issue
					</h1>
					<p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
						Help your neighbors | act fast | Share what happened and where it
						needs attention.
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
								{/* <p className="mt-1 text-sm text-slate-400">Required fields are marked with an asterisk.</p> */}
                                <p className="mt-1 text-sm text-slate-400">Write as a member ,Fix as a community...</p>
							</div>
						</div>

						<div className="space-y-6">
							<label className="block">
								<span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-300">Issue category <span className="text-rose-400">*</span></span>
								<span className="relative block">
									<select
										value={category}
										onChange={(event) => setCategory(event.target.value)}
										className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
									>
										<option value="">Select an issue type</option>
										{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)
                                        //rendering all the options in select
                                        }
									</select>
									<ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
								</span>
							</label>

							<label className="block">
								<span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-300">Description <span className="text-rose-400">*</span></span>
								<textarea
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									placeholder="Describe the issue, its impact, and anything your community team should know..."
									rows="5"
									className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500 transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
								/>
								<span className="mt-2 block text-right text-xs text-slate-500">{description.length}/500</span>
							</label>

							<label className="block">
								<span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-300">Location <span className="text-rose-400">*</span></span>
								<span className="relative block">
									<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
									<input value={location} onChange={(event) => setLocation(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-12 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
									<button type="button" aria-label="Use current location" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-blue-400"><Crosshair size={17} /></button>
								</span>
							</label>

							<div>
								<span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-300">Add a photo <span className="font-normal normal-case tracking-normal text-slate-500">(optional)</span></span>
								<label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-4 py-4 transition-colors duration-200 hover:border-emerald-500/60 hover:bg-slate-900">
									<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300"><ImagePlus size={19} /></span>
									<span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-200">{photoName || "Upload an image of the issue"}</span><span className="mt-1 block text-xs text-slate-500">JPG or PNG, up to 10 MB</span></span>
									<Camera size={18} className="text-slate-500" />
									<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => setPhotoName(event.target.files?.[0]?.name || "")} />
								</label>
							</div>
						</div>

						<div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
							<p className="flex items-center gap-2 text-xs leading-5 text-slate-500"><Sparkles size={15} className="shrink-0 text-purple-400" /> AI will help route your report.</p>
							<button type="submit" disabled={!canSubmit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-200 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"><Send size={17} /> Submit Report</button>
						</div>
					</form>

					<aside className="space-y-4">
						<section className="rounded-2xl border border-blue-500/20 bg-[#0D1524] p-5">
							<div className="mb-4 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400"><ShieldCheck size={19} /></div><h2 className="text-sm font-bold">What happens next?</h2></div>
							<ol className="space-y-4 text-sm text-slate-400">
								<li className="flex gap-3"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">1</span><span>Our team reviews and verifies your report.</span></li>
								<li className="flex gap-3"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">2</span><span>It is routed to the right community team.</span></li>
								<li className="flex gap-3"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-400">3</span><span>You receive updates as it moves forward.</span></li>
							</ol>
						</section>
						<section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5"><div className="flex gap-3"><AlertTriangle size={18} className="shrink-0 text-amber-400" /><div><h2 className="text-sm font-bold text-amber-300">Emergency?</h2><p className="mt-1 text-xs leading-5 text-slate-400">For immediate danger or a crime in progress, use the emergency service instead.</p></div></div></section>
					</aside>
				</div>
			</div>
		</main>
	);
}
