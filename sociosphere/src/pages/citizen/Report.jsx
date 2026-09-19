import { useState ,useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { addIssue } from "../../data/mockIssues";
import {
  AlertTriangle,
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
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  Trash2,
  UploadCloud,
  Film,
  Image as ImageIcon,
  Eye,
  AlertCircle,
  Volume2
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
  {
    label: "Low",
    value: "LOW PRIORITY",
    class: "low",
    active:
      "border-blue-500 bg-blue-500/15 text-blue-400 font-bold",
  },
  {
    label: "Medium",
    value: "MEDIUM PRIORITY",
    class: "medium",
    active:
      "border-amber-500 bg-amber-500/15 text-amber-400 font-bold",
  },
  {
    label: "High",
    value: "HIGH PRIORITY",
    class: "high",
    active:
      "border-orange-500 bg-orange-500/15 text-orange-400 font-bold",
  },
  {
    label: "Critical",
    value: "CRITICAL PRIORITY",
    class: "critical",
    active:
      "border-rose-500 bg-rose-500/15 text-rose-400 font-bold",
  },
];

const headingStyle =
  "mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300";
// const headingStyle = "mb-2 block text-xs font-bold uppercase tracking-wide text-slate-300";

export default function Report({ onClose, isEmbedded = false, onSuccess }) {
	const navigate = useNavigate();
	const { theme } = useTheme();
	const { user } = useAuth();
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

  category: categoryObj
    ? categoryObj.label
    : category,

  categoryValue: category,

  description: description.trim(),

  location: location.trim(),

  priority,

  priorityClass: priorityObj.class,

  status: "In Progress",

  statusClass: "progress",

  date: `${dateString}, ${timeString}`,

  time: timeString,

  rawDate: dateString,

  timestamp: now.toISOString(),

  createdAt: now.toISOString(),

  updatedAt: now.toISOString(),

  eta: "Pending Dispatch",

  photoName: photoName || null,

  image: null,

  // ================================
  // CURRENT LOGGED-IN USER & COLONY
  // ================================

  reportedBy: user?.name || "Citizen",

  personName: user?.name || "Citizen",

  reportedByEmail:
    user?.email?.trim().toLowerCase() || "",

  reportedById:
    user?.id || "",

  communityId:
    user?.communityId || "colony-1",

  communityName:
    user?.communityName || "Green Meadows Heights",

  colony:
    user?.communityName || user?.communityId || "Green Meadows Heights",
  
  reportType: "civic",
};

		// Save one shared record: citizens see only their own records, while authorities see all.
		try {
			const savedIssue = addIssue({
				...newIssue,
				severity: priorityObj.class === "high" || priorityObj.class === "critical" ? "High" : priorityObj.class === "medium" ? "Medium" : "Low",
				reporterAvatar: user?.avatar || null,
			});

			const stored = JSON.parse(localStorage.getItem("sociosphere_user_reports") || "[]");
			localStorage.setItem("sociosphere_user_reports", JSON.stringify([newIssue, ...stored]));

			window.dispatchEvent(new Event("sociosphere_data_updated"));
			setSubmittedIssue(savedIssue);
		} catch (e) {
			console.error("Failed to save report to localStorage:", e);
		}

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
			<main className={`${theme === "dark" ? "theme-dark" : "theme-light"} ${isEmbedded ? "p-2" : "min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070B14] dark:text-[#F8FAFC] px-4 py-6"} sm:px-6 lg:px-8`}>
				<div className={`mx-auto flex ${isEmbedded ? "min-h-auto" : "min-h-[calc(100vh-3rem)]"} max-w-3xl items-center justify-center`}>
					<section className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10 shadow-xl dark:border-slate-800 dark:bg-[#0D1524]">
						<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
							<CheckCircle2 size={34} strokeWidth={1.8} />
						</div>
						<p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
							Report submitted & recorded
						</p>
						<h1 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
							Thank you for helping your community.
						</h1>
						<p className="mx-auto mb-6 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
							Your issue has been saved to your reported items list with timestamp and tracking details.
						</p>

						{/* Submitted Card Summary */}
						<div className="mx-auto mb-8 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-900/80">
							<div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
								<span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{submittedIssue.id}</span>
								<span className="flex items-center gap-1"><Clock size={13} /> {submittedIssue.date}</span>
							</div>
							<h3 className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100">{submittedIssue.title}</h3>
							<p className="mb-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{submittedIssue.description}</p>
							<div className="flex flex-wrap gap-2 text-xs">
								<span className="rounded-md bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 px-2 py-1">{submittedIssue.category}</span>
								<span className="rounded-md bg-amber-500/15 px-2 py-1 font-semibold text-amber-700 dark:text-amber-300">{submittedIssue.priority}</span>
								<span className="rounded-md bg-blue-500/15 px-2 py-1 font-semibold text-blue-700 dark:text-blue-300">{submittedIssue.location}</span>
							</div>
						</div>

						<div className="flex flex-wrap justify-center gap-3">
							<button
								type="button"
								onClick={resetForm}
								className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-emerald-500 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
							>
								<FileText size={17} />
								Submit another report
							</button>
							<button
								type="button"
								onClick={() => (onClose ? onClose() : navigate("/citizen/home"))}
								className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
							>
								Back to Dashboard
							</button>
						</div>
					</section>
				</div>
			</main>
		);
	}

	return (
		<main className={`${theme === "dark" ? "theme-dark" : "theme-light"} ${isEmbedded ? "p-0" : "min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070B14] dark:text-[#F8FAFC]"}`}>
			{!isEmbedded && (
				<header className="border-b border-slate-200 bg-white dark:border-slate-800/80 dark:bg-[#080E1A]">
					<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
						<button
							type="button"
							className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
							onClick={() => (onClose ? onClose() : navigate("/citizen/home"))}
						>
							<ArrowLeft size={18} />
							Back to dashboard
						</button>
						<div className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400 sm:flex">
							<ShieldCheck size={17} />
							Citizen services
						</div>
					</div>
				</header>
			)}

			<div className={`mx-auto max-w-7xl ${isEmbedded ? "p-2" : "px-4 py-8 sm:px-6 sm:py-10 lg:px-8"}`}>
				<div className="mb-8 max-w-2xl">
					<p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
						Community care
					</p>
					<h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
						Report an issue
					</h1>
					<p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
						Help your neighbors | act fast | Share what happened and where it needs attention.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
					<form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
						<div className="mb-8 flex items-start gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
								<AlertTriangle size={22} />
							</div>
							<div>
								<h2 className="text-lg font-bold text-slate-900 dark:text-white">Tell us what needs fixing</h2>
								<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Write as a member, Fix as a community...</p>
							</div>
						</div>

						<div className="space-y-6">
							{/* Title Field */}
							<label className="block">
								<span className={headingStyle}>Issue Title <span className="text-rose-500">*</span></span>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="e.g. Major Water Leakage near Basement P2 Entrance"
									className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
									required
								/>
							</label>

							{/* Category & Priority Grid */}
							<div className="grid gap-6 sm:grid-cols-2">
								<label className="block">
									<span className={headingStyle}>Issue category <span className="text-rose-500">*</span></span>
									<span className="relative block">
										<select
											value={category}
											onChange={(event) => setCategory(event.target.value)}
											className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
										>
											<option value="">Select an issue type</option>
											{categories.map((item) => (
												<option key={item.value} value={item.value}>{item.label}</option>
											))}
										</select>
										<ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
									</span>
								</label>

								<div className="block">
									<span className={headingStyle}>Priority Level <span className="text-rose-500">*</span></span>
									<div className="grid grid-cols-2 gap-2">
										{priorityOptions.map((p) => (
											<button
												key={p.value}
												type="button"
												onClick={() => setPriority(p.value)}
												className={`rounded-xl border py-2.5 px-2 text-center text-xs tracking-wide transition-all ${
													priority === p.value
														? p.active
														: "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
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
								<span className={headingStyle}>Description <span className="text-rose-500">*</span></span>
								<textarea
									value={description}
									onChange={(event) => setDescription(event.target.value)}
									placeholder="Describe the issue, its impact, and anything your community team should know..."
									rows="4"
									maxLength={1000}
									className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
								/>
								<span className="mt-2 block text-right text-xs text-slate-400 dark:text-slate-500">{description.length}/1000</span>
							</label>

							{/* Location Field */}
							<label className="block">
								<span className={headingStyle}>Location <span className="text-rose-500">*</span></span>
								<span className="relative block">
									<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400" size={18} />
									<input
										value={location}
										onChange={(event) => setLocation(event.target.value)}
										className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
									/>
									<button
										type="button"
										aria-label="Use current location"
										className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
									>
										<Crosshair size={17} />
									</button>
								</span>
							</label>

							{/* Photo Upload */}
							<div>
								<span className={headingStyle}>Add a photo <span className="font-normal normal-case tracking-normal text-slate-400 dark:text-slate-500">(optional)</span></span>
								{photoUrl ? (
									<div className="relative rounded-xl border border-emerald-500/40 bg-slate-50 p-2 dark:bg-slate-900">
										<div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-950">
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
										<div className="mt-2 flex items-center justify-between px-1 text-xs text-slate-600 dark:text-slate-400">
											<span className="truncate font-mono">{photoName}</span>
											<span className="font-semibold text-emerald-600 dark:text-emerald-400">Image Loaded</span>
										</div>
									</div>
								) : (
									<label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition-colors duration-200 hover:border-emerald-500/60 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-900">
										<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"><ImagePlus size={19} /></span>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{photoName || "Upload an image of the issue"}</span>
											<span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">JPG or PNG, up to 10 MB</span>
										</span>
										<Camera size={18} className="text-slate-400 dark:text-slate-500" />
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
						<div className="mt-8 flex flex-col-reverse gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1">
								
								<p className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
									<Clock size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" /> Submission date & time will be automatically logged.
								</p>
							</div>
							<button
								type="submit"
								disabled={!canSubmit}
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 shrink-0 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
							>
								<Send size={17} /> Submit Report
							</button>
						</div>
					</form>

					{/* Sidebar instructions */}
					<aside className="space-y-4">
						<UploadEvidence />
					</aside>
				</div>
			</div>
		</main>
	);
}


/**
 * Miljot's Wow feature -> Evidence Recording
 * Reusable UploadEvidence Component
 * Supports:
 * - Direct camera video recording with sound (WebRTC / MediaRecorder)
 * - Photo snapshots via camera
 * - File selection restricted to photos and videos
 * - Playback preview with sound and lightbox modal
 * - Ready for IndexedDB storage
 */
export function UploadEvidence({ evidenceList: externalEvidenceList, setEvidenceList: externalSetEvidenceList, onEvidenceChange }) {
	const [internalList, setInternalList] = useState([]);
	const evidenceList = externalEvidenceList !== undefined ? externalEvidenceList : internalList;
	const setEvidenceList = externalSetEvidenceList !== undefined ? externalSetEvidenceList : setInternalList;

	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [cameraError, setCameraError] = useState(null);
	const [previewItem, setPreviewItem] = useState(null);
	const [isDragging, setIsDragging] = useState(false);

	const videoRef = useRef(null);
	const mediaStreamRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);
	const timerRef = useRef(null);
	const fileInputRef = useRef(null);

	const formatFileSize = (bytes) => {
		if (!bytes || bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const addEvidenceItem = (item) => {
		setEvidenceList((prev) => {
			const next = [item, ...prev];
			if (onEvidenceChange) onEvidenceChange(next);
			return next;
		});
	};

	const removeEvidenceItem = (id) => {
		setEvidenceList((prev) => {
			const target = prev.find((item) => item.id === id);
			if (target && target.url && target.url.startsWith("blob:")) {
				URL.revokeObjectURL(target.url);
			}
			const next = prev.filter((item) => item.id !== id);
			if (onEvidenceChange) onEvidenceChange(next);
			return next;
		});
		if (previewItem?.id === id) {
			setPreviewItem(null);
		}
	};

	// Start live camera stream with audio
	const startCamera = async () => {
		setCameraError(null);
		try {
			let stream;
			try {
				// Request both camera and microphone for video with sound
				stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "environment",
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
					audio: true,
				});
			} catch (micErr) {
				console.warn("Failed to get audio+video stream, trying video only:", micErr);
				// Fallback to video only if microphone is unavailable/blocked
				stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false,
				});
			}

			mediaStreamRef.current = stream;
			setIsCameraOpen(true);
		} catch (err) {
			console.error("Camera access error:", err);
			let errorMsg = "Unable to access camera or microphone. Please verify hardware permissions.";
			if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
				errorMsg = "Camera / Microphone permission denied. Please allow camera and microphone access in browser settings.";
			} else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
				errorMsg = "No camera or microphone device detected on this system.";
			}
			setCameraError(errorMsg);
			setIsCameraOpen(true);
		}
	};

	// Attach video stream when video element renders
	useEffect(() => {
		if (isCameraOpen && videoRef.current && mediaStreamRef.current) {
			videoRef.current.srcObject = mediaStreamRef.current;
		}
	}, [isCameraOpen]);

	// Clean up camera stream on unmount
	useEffect(() => {
		return () => {
			if (mediaStreamRef.current) {
				mediaStreamRef.current.getTracks().forEach((track) => track.stop());
			}
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	// Stop camera stream
	const stopCamera = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
		}
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((track) => track.stop());
			mediaStreamRef.current = null;
		}
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setIsRecording(false);
		setRecordingTime(0);
		setIsCameraOpen(false);
		setCameraError(null);
	};

	// Start recording video with sound
	const startRecording = () => {
		if (!mediaStreamRef.current) return;
		chunksRef.current = [];

		const mimeTypes = [
			"video/webm;codecs=vp9,opus",
			"video/webm;codecs=vp8,opus",
			"video/webm",
			"video/mp4",
		];
		const supportedMime = mimeTypes.find((mime) => MediaRecorder.isTypeSupported(mime)) || "";

		try {
			const options = supportedMime ? { mimeType: supportedMime } : {};
			const recorder = new MediaRecorder(mediaStreamRef.current, options);
			mediaRecorderRef.current = recorder;

			recorder.ondataavailable = (event) => {
				if (event.data && event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			recorder.onstop = () => {
				const blobType = supportedMime || "video/webm";
				const blob = new Blob(chunksRef.current, { type: blobType });
				const url = URL.createObjectURL(blob);
				console.log(url);
				const now = new Date();
				const timeStamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
				const dateStamp = now.toISOString().slice(0, 10);

				const hasAudio = mediaStreamRef.current
					? mediaStreamRef.current.getAudioTracks().length > 0
					: false;

				const newVideoEvidence = {
					id: `evidence-vid-${Date.now()}`,
					name: `Recorded_Evidence_${dateStamp}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}.webm`,
					type: "video",
					mimeType: blobType,
					size: blob.size,
					sizeFormatted: formatFileSize(blob.size),
					url,
					blob,
					hasAudio,
					recordedAt: timeStamp,
					date: dateStamp,
				};

				addEvidenceItem(newVideoEvidence);
			};

			recorder.start(200);
			setIsRecording(true);
			setRecordingTime(0);

			timerRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);
		} catch (err) {
			console.error("Failed to start MediaRecorder:", err);
			setCameraError("Video recording failed on this browser. " + err.message);
		}
	};

	// Stop recording video
	const stopRecording = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
			mediaRecorderRef.current.stop();
		}
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
		setIsRecording(false);
	};

	// Take snapshot photo from camera
	const captureSnapshot = () => {
		if (!videoRef.current) return;
		const video = videoRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth || 1280;
		canvas.height = video.videoHeight || 720;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(
			(blob) => {
				if (!blob) return;
				const url = URL.createObjectURL(blob);
				const now = new Date();
				const timeStamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
				const dateStamp = now.toISOString().slice(0, 10);

				const newPhotoEvidence = {
					id: `evidence-img-${Date.now()}`,
					name: `Snapshot_${dateStamp}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}.jpg`,
					type: "image",
					mimeType: "image/jpeg",
					size: blob.size,
					sizeFormatted: formatFileSize(blob.size),
					url,
					blob,
					recordedAt: timeStamp,
					date: dateStamp,
				};

				addEvidenceItem(newPhotoEvidence);
			},
			"image/jpeg",
			0.92
		);
	};

	// Handle file selection (Photos and Videos only)
	const handleFileSelect = (event) => {
		const files = Array.from(event.target.files || []);
		processFiles(files);
		if (event.target) event.target.value = "";
	};

	const processFiles = (files) => {
		files.forEach((file) => {
			const isVideo = file.type.startsWith("video/");
			const isImage = file.type.startsWith("image/");
			if (!isVideo && !isImage) return;

			const url = URL.createObjectURL(file);
			const now = new Date();
			const timeStamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

			const newEvidence = {
				id: `evidence-file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
				name: file.name,
				type: isVideo ? "video" : "image",
				mimeType: file.type,
				size: file.size,
				sizeFormatted: formatFileSize(file.size),
				url,
				blob: file,
				hasAudio: isVideo,
				recordedAt: timeStamp,
				date: now.toISOString().slice(0, 10),
			};

			addEvidenceItem(newEvidence);
		});
	};

	// Drag & drop handlers
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			processFiles(Array.from(e.dataTransfer.files));
		}
	};

	return (
		<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
			{/* Section Header */}
			<div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
				<div className="flex items-center gap-2.5">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
						<Camera size={19} />
					</div>
					<div>
						<h2 className="text-sm font-bold text-slate-900 dark:text-white">Upload Evidence</h2>
						<p className="text-[11px] text-slate-500 dark:text-slate-400">Photos & audio-enabled videos</p>
					</div>
				</div>
				{evidenceList.length > 0 && (
					<span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
						{evidenceList.length} attached
					</span>
				)}
			</div>

			{/* Camera & Recorder Box */}
			{!isCameraOpen ? (
				<button
					type="button"
					onClick={startCamera}
					className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:border-slate-700/80 dark:bg-slate-900/60 dark:hover:border-emerald-500/50 dark:hover:bg-slate-900"
				>
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition-transform duration-200 group-hover:scale-105">
						<Camera size={22} />
					</div>
					<div className="text-left">
						<span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
							Open Camera & Mic
						</span>
						<span className="block text-xs text-slate-500 dark:text-slate-400">
							Record live video with sound or take photo
						</span>
					</div>
				</button>
			) : (
				<div className="overflow-hidden rounded-xl border border-emerald-500/40 bg-slate-950 p-3 text-white shadow-lg">
					{cameraError ? (
						<div className="p-3 text-center">
							<AlertCircle className="mx-auto mb-2 text-rose-400" size={28} />
							<p className="text-xs text-rose-300 mb-3">{cameraError}</p>
							<div className="flex justify-center gap-2">
								<button
									type="button"
									onClick={startCamera}
									className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
								>
									Retry
								</button>
								<button
									type="button"
									onClick={stopCamera}
									className="rounded-lg bg-rose-600/20 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-600/30"
								>
									Close
								</button>
							</div>
						</div>
					) : (
						<div className="space-y-3">
							{/* Live Video Viewfinder */}
							<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className="h-full w-full object-cover"
								/>

								{/* Recording Indicator & Timer */}
								{isRecording ? (
									<div className="absolute left-2.5 top-2.5 flex items-center gap-2 rounded-full bg-rose-600/90 px-3 py-1 text-xs font-bold text-white shadow backdrop-blur-sm animate-pulse">
										<span className="h-2 w-2 rounded-full bg-white animate-ping" />
										<span>REC {formatTime(recordingTime)}</span>
										<Mic size={13} className="ml-0.5" />
									</div>
								) : (
									<div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 backdrop-blur-sm">
										<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
										<span>Live Cam • Audio ON</span>
									</div>
								)}

								{/* Close camera button */}
								<button
									type="button"
									onClick={stopCamera}
									className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-slate-300 hover:bg-rose-600 hover:text-white transition-colors"
									title="Close camera"
								>
									<X size={15} />
								</button>
							</div>

							{/* Camera Controls */}
							<div className="flex flex-wrap items-center justify-between gap-2 pt-1">
								{isRecording ? (
									<button
										type="button"
										onClick={stopRecording}
										className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-colors"
									>
										<Square size={14} fill="currentColor" /> Stop & Save Video
									</button>
								) : (
									<div className="flex w-full gap-2">
										<button
											type="button"
											onClick={startRecording}
											className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow hover:bg-rose-500 transition-colors"
										>
											<Video size={14} /> Record Video (Sound)
										</button>
										<button
											type="button"
											onClick={captureSnapshot}
											className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
										>
											<Camera size={14} /> Photo
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Choose Files Option (Photos or Videos Only) */}
			<div className="mt-3">
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() => fileInputRef.current?.click()}
					className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center transition-all duration-200 ${
						isDragging
							? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-500/10"
							: "border-slate-300 bg-slate-50 hover:border-emerald-500/60 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-emerald-500/40 dark:hover:bg-slate-900"
					}`}
				>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*,video/*"
						multiple
						onChange={handleFileSelect}
						className="hidden"
					/>
					<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-transform duration-200 group-hover:scale-110 dark:bg-slate-800 dark:text-slate-300">
						<UploadCloud size={20} />
					</div>
					<span className="text-xs font-bold text-slate-800 dark:text-slate-200">
						Choose photos or videos
					</span>
					<span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
						Drag & drop or browse (MP4, WebM, MOV, JPG, PNG)
					</span>
				</div>
			</div>

			{/* Attached Evidence List */}
			{evidenceList.length > 0 && (
				<div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
					<div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
						<span>ATTACHED EVIDENCE ({evidenceList.length})</span>
						<span className="text-emerald-600 dark:text-emerald-400 font-mono">
							{formatFileSize(evidenceList.reduce((acc, curr) => acc + (curr.size || 0), 0))}
						</span>
					</div>

					<div className="max-h-60 space-y-2 overflow-y-auto pr-1">
						{evidenceList.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 transition-colors dark:border-slate-800 dark:bg-slate-900/70"
							>
								{/* Thumbnail / Icon */}
								<div
									onClick={() => setPreviewItem(item)}
									className="relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800"
								>
									{item.type === "image" ? (
										<img src={item.url} alt={item.name} className="h-full w-full object-cover" />
									) : (
										<div className="flex h-full w-full items-center justify-center bg-slate-900 text-emerald-400">
											<Film size={18} />
										</div>
									)}
									<div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
										<Eye size={14} className="text-white" />
									</div>
								</div>

								{/* Details */}
								<div className="min-w-0 flex-1">
									<p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
										{item.name}
									</p>
									<div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
										<span className={`inline-flex items-center gap-0.5 font-semibold ${item.type === "video" ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"}`}>
											{item.type === "video" ? <Film size={11} /> : <ImageIcon size={11} />}
											{item.type === "video" ? "Video + Audio" : "Photo"}
										</span>
										<span>•</span>
										<span>{item.sizeFormatted}</span>
									</div>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-1 shrink-0">
									<button
										type="button"
										onClick={() => setPreviewItem(item)}
										className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400 transition-colors"
										title="Preview"
									>
										<Eye size={14} />
									</button>
									<button
										type="button"
										onClick={() => removeEvidenceItem(item.id)}
										className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors"
										title="Delete item"
									>
										<Trash2 size={14} />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Lightbox / Preview Modal for Videos & Photos */}
			{previewItem && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
					<div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
						{/* Modal Header */}
						<div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
							<div className="flex items-center gap-2">
								{previewItem.type === "video" ? (
									<Film size={17} className="text-purple-400" />
								) : (
									<ImageIcon size={17} className="text-blue-400" />
								)}
								<span className="text-xs font-bold truncate max-w-sm text-black">{previewItem.name}</span>
							</div>
							<button
								type="button"
								onClick={() => setPreviewItem(null)}
								className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
							>
								<X size={18} />
							</button>
						</div>

						{/* Modal Media Content */}
						<div className="flex max-h-[70vh] items-center justify-center bg-black p-2">
							{previewItem.type === "video" ? (
								<video
									src={previewItem.url}
									controls
									autoPlay
									className="max-h-[65vh] w-full rounded-lg object-contain"
								/>
							) : (
								<img
									src={previewItem.url}
									alt={previewItem.name}
									className="max-h-[65vh] w-full rounded-lg object-contain"
								/>
							)}
						</div>

						{/* Modal Footer */}
						<div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-400">
							<div className="flex items-center gap-2 text-white">
								<span>Size: {previewItem.sizeFormatted}</span>
								{previewItem.type === "video" && (
									<span className="flex items-center gap-1 rounded bg-purple-500/20 px-2 py-0.5 text-purple-300 font-semibold">
										<Volume2 size={12} /> Audio Included
									</span>
								)}
							</div>
							<button
								type="button"
								onClick={() => setPreviewItem(null)}
								className="rounded-lg bg-slate px-3 py-1.5 font-bold text-white hover:bg-slate-700 transition-colors"
							>
								Close Preview
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
