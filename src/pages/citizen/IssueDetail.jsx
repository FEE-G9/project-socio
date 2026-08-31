import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock3,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Building2,
  Flag,
  MessageSquare,
  FileImage,
  ChevronRight,
  User,
  Bell,
  Send,
  AlertTriangle,
} from 'lucide-react';

const mockIssues = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    category: 'Infrastructure',
    status: 'In Progress',
    priority: 'High',
    location: 'Main St & 5th Ave',
    reportedAt: '2024-08-28T09:15:00',
    lastUpdated: '2024-08-30T14:20:00',
    issueId: 'ISS-2048',
    description:
      'Large pothole near the school crossing is causing traffic disruption and posing a risk to pedestrians and two-wheelers. The damaged section has widened after heavy rain and needs immediate attention.',
    evidence: 'Three photos uploaded showing the damaged road surface and wheel marks.',
    department: 'Municipal Roads Department',
    assignedTo: 'Road Maintenance Team',
    aiSummary: [
      'Repeated complaints in the same lane suggest the issue has been worsening over the past 2 weeks.',
      'The traffic risk is moderate to high due to school zone proximity and regular commuter activity.',
      'This issue should remain in the active queue until surface repair is completed and inspected.',
    ],
    timeline: [
      { label: 'Reported', date: 'Aug 28, 09:15', complete: true },
      { label: 'Acknowledged', date: 'Aug 28, 15:40', complete: true },
      { label: 'In Progress', date: 'Aug 30, 14:20', complete: true },
      { label: 'Resolved', date: 'Pending', complete: false },
    ],
    updates: [
      {
        author: 'Road Maintenance Team',
        time: 'Today, 2:20 PM',
        text: 'Inspection completed and repair crew assigned to the damaged patch. Work order approved for road resurfacing.',
      },
      {
        author: 'Resident',
        time: 'Yesterday, 7:10 PM',
        text: 'Need urgent repair before school reopening. The road is becoming unsafe for cyclists and scooters.',
      },
    ],
    comments: [
      {
        user: 'Arun S',
        time: '2 hours ago',
        text: 'The road condition is worse after the last rainfall. This needs faster action.',
      },
      {
        user: 'Priya M',
        time: '1 day ago',
        text: 'Thanks for the update. Please keep residents informed about the repair ETA.',
      },
    ],
    resolution: {
      summary: 'Repair work is scheduled for the damaged section after inspection. Temporary traffic signage will be placed until final resurfacing is complete.',
      followUp: 'Final inspection is required after repair and before closure.',
    },
    related: [
      { id: 2, title: 'Street Light Malfunction', status: 'Reported' },
      { id: 3, title: 'Park Playground Repairs', status: 'Resolved' },
    ],
  },
  {
    id: 2,
    title: 'Street Light Malfunction',
    category: 'Utilities',
    status: 'Reported',
    priority: 'High',
    location: 'Oak Street',
    reportedAt: '2024-08-27T18:30:00',
    lastUpdated: '2024-08-27T18:30:00',
    issueId: 'ISS-2049',
    description:
      'Streetlight at the corner of Oak Street and 3rd Avenue has stopped working, creating visibility concerns for residents and pedestrians.',
    evidence: 'Photo evidence uploaded showing a dark street corner with no public lighting.',
    department: 'Electricity & Lighting Division',
    assignedTo: 'Field Support Unit',
    aiSummary: [
      'This is a public safety issue affecting visibility at night and increasing risk of accidents.',
      'The problem appears isolated to one streetlight, which should be fixable within a short maintenance window.',
      'Priority remains high until the light is repaired and the safety check is completed.',
    ],
    timeline: [
      { label: 'Reported', date: 'Aug 27, 18:30', complete: true },
      { label: 'Acknowledged', date: 'Pending', complete: false },
      { label: 'In Progress', date: 'Pending', complete: false },
      { label: 'Resolved', date: 'Pending', complete: false },
    ],
    updates: [
      {
        author: 'City Utility Desk',
        time: 'Today, 9:15 AM',
        text: 'We have received the report and assigned a technician for inspection of the faulty streetlight.',
      },
    ],
    comments: [
      {
        user: 'Neha P',
        time: '3 hours ago',
        text: 'This corner is very dark at night. Please fix it soon.',
      },
    ],
    resolution: {
      summary: 'No resolution yet. The utility team is reviewing the lighting circuit and scheduling inspection.',
      followUp: 'Residents will be updated after the technician visit and repair outcome.',
    },
    related: [
      { id: 1, title: 'Pothole on Main Street', status: 'In Progress' },
      { id: 4, title: 'Water Leak Near Park Gate', status: 'Resolved' },
    ],
  },
  {
    id: 3,
    title: 'Park Playground Repairs',
    category: 'Parks',
    status: 'Resolved',
    priority: 'Medium',
    location: 'Central Park',
    reportedAt: '2024-08-25T11:00:00',
    lastUpdated: '2024-08-29T16:10:00',
    issueId: 'ISS-2050',
    description:
      'Swing set at the north end of Central Park requires maintenance after several bolts became loose and a seat was damaged.',
    evidence: 'Photos uploaded showing loose hardware and damaged swing seat.',
    department: 'Parks & Recreation Department',
    assignedTo: 'Maintenance Crew',
    aiSummary: [
      'The issue was isolated to one equipment set and did not affect broader park usage.',
      'The repair was completed with a full safety inspection to prevent further breakage.',
      'The community can continue to use the park with increased reassurance that the equipment is safe.',
    ],
    timeline: [
      { label: 'Reported', date: 'Aug 25, 11:00', complete: true },
      { label: 'Acknowledged', date: 'Aug 25, 13:20', complete: true },
      { label: 'In Progress', date: 'Aug 27, 10:00', complete: true },
      { label: 'Resolved', date: 'Aug 29, 16:10', complete: true },
    ],
    updates: [
      {
        author: 'Parks Team',
        time: 'Aug 29, 4:10 PM',
        text: 'The swing set has been repaired and checked for safety. The equipment is back in service.',
      },
    ],
    comments: [
      {
        user: 'Sara K',
        time: '3 days ago',
        text: 'Thank you for fixing it so quickly. It was getting unsafe for kids.',
      },
    ],
    resolution: {
      summary: 'Damaged swing seat replaced and all fasteners tightened. Safety inspection passed.',
      followUp: 'Routine monthly checks scheduled for the play area.',
    },
    related: [
      { id: 5, title: 'Garbage Collection Delay', status: 'Resolved' },
      { id: 1, title: 'Pothole on Main Street', status: 'In Progress' },
    ],
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Resolved':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'In Progress':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Reported':
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    case 'Acknowledged':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical':
      return 'text-rose-400';
    case 'High':
      return 'text-amber-400';
    case 'Medium':
      return 'text-blue-400';
    case 'Low':
      return 'text-slate-400';
    default:
      return 'text-slate-400';
  }
};

const IssueDetail = () => {
  const { id } = useParams();
  const issue = mockIssues.find((item) => item.id === Number(id)) || mockIssues[0];

  return (
    <div className="space-y-8">
      {/* Back button / breadcrumb */}
      <section>
        <Link
          to="/citizen/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
      </section>

      {/* Header */}
      <section className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-slate-800/50 text-slate-300 text-xs font-semibold rounded-full">
                {issue.category}
              </span>
              <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}>
                {issue.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
              {issue.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-slate-400" />
                {issue.issueId}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {issue.location}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 lg:flex-col xl:flex-row">
            <button className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-200">
              Follow issue
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-slate-950 rounded-xl font-semibold hover:bg-emerald-400 transition-all duration-200">
              Update status
            </button>
          </div>
        </div>
      </section>

      {/* Issue Summary Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-5">Issue Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Reported Date
                </p>
                <p className="text-slate-100 font-semibold text-sm">
                  {new Date(issue.reportedAt).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                  <Clock3 className="w-4 h-4" />
                  Last Updated
                </p>
                <p className="text-slate-100 font-semibold text-sm">
                  {new Date(issue.lastUpdated).toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Current Status
                </p>
                <p className={`inline-flex px-3 py-1 border rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </p>
              </div>
              <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
                <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Priority
                </p>
                <p className={`text-sm font-bold ${getPriorityColor(issue.priority)}`}>
                  {issue.priority} Priority
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Assigned Authority</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Building2 className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Department</p>
                  <p className="text-slate-100 text-sm font-semibold">{issue.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <User className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Assigned Team</p>
                  <p className="text-slate-100 text-sm font-semibold">{issue.assignedTo}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Description + Evidence + AI Analysis */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Issue Description</h2>
            <p className="text-slate-400 text-sm leading-7">
              {issue.description}
            </p>
          </div>

          <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <FileImage className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-slate-100">Evidence & Photos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-56 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/70 to-[#111A2B] flex items-center justify-center text-center p-6">
                <div>
                  <FileImage className="w-12 h-12 text-slate-400 mx-auto mb-4" strokeWidth={1.2} />
                  <p className="text-slate-300 font-semibold">Road damage evidence</p>
                  <p className="text-xs text-slate-500 mt-2">Image 1 of 3</p>
                </div>
              </div>
              <div className="h-56 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/70 to-[#111A2B] flex items-center justify-center text-center p-6">
                <div>
                  <FileImage className="w-12 h-12 text-slate-400 mx-auto mb-4" strokeWidth={1.2} />
                  <p className="text-slate-300 font-semibold">Inspection location</p>
                  <p className="text-xs text-slate-500 mt-2">Image 2 of 3</p>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              {issue.evidence}
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-gradient-to-br from-[#0D1524] to-[#111A2B] border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">AI Analysis</h3>
            </div>
            <div className="space-y-3">
              {issue.aiSummary.map((entry, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                  <p className="text-slate-300 text-sm leading-6">{entry}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Timeline */}
      <section className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Issue Status Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {issue.timeline.map((step, index) => (
            <div key={index} className="relative pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.complete ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border border-slate-700 text-slate-500'}`}>
                  {step.complete ? <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} /> : <Clock3 className="w-5 h-5" strokeWidth={1.5} />}
                </div>
                <div>
                  <p className="text-slate-100 font-semibold text-sm">{step.label}</p>
                  <p className="text-xs text-slate-500">{step.date}</p>
                </div>
              </div>
              {index < issue.timeline.length - 1 && (
                <div className="hidden xl:block absolute left-5 top-10 h-10 w-px bg-slate-700" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Authority updates + comments */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-slate-100">Authority Updates</h2>
          </div>
          <div className="space-y-4">
            {issue.updates.map((update, index) => (
              <div key={index} className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-slate-100 font-semibold text-sm">{update.author}</p>
                  <span className="text-xs text-slate-500">{update.time}</span>
                </div>
                <p className="text-slate-400 text-sm leading-6">{update.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
            <h2 className="text-2xl font-bold text-slate-100">Citizen Comments</h2>
          </div>
          <div className="space-y-4">
            {issue.comments.map((comment, index) => (
              <div key={index} className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-slate-100 font-semibold text-sm">{comment.user}</p>
                  <span className="text-xs text-slate-500">{comment.time}</span>
                </div>
                <p className="text-slate-400 text-sm leading-6">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resolution details + related issues */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Resolution Details</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
              <p className="text-slate-400 text-sm mb-2">Resolution Summary</p>
              <p className="text-slate-200 text-sm leading-6">{issue.resolution.summary}</p>
            </div>
            <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-xl">
              <p className="text-slate-400 text-sm mb-2">Follow-up Action</p>
              <p className="text-slate-200 text-sm leading-6">{issue.resolution.followUp}</p>
            </div>
          </div>
        </div>

        <aside className="bg-[#0D1524] border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="text-2xl font-bold text-slate-100">Related Issues</h2>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {issue.related.map((relatedIssue) => (
              <Link
                key={relatedIssue.id}
                to={`/citizen/issue/${relatedIssue.id}`}
                className="block p-4 bg-slate-800/20 border border-slate-800 rounded-xl hover:border-slate-700 hover:bg-[#111A2B] transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-slate-100 text-sm font-semibold">{relatedIssue.title}</p>
                  </div>
                  <span className={`px-2 py-1 border rounded-full text-[10px] font-semibold ${getStatusColor(relatedIssue.status)}`}>
                    {relatedIssue.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {/* Action buttons */}
      <section className="flex flex-col sm:flex-row gap-3 pb-4">
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 rounded-xl font-semibold hover:bg-emerald-400 transition-all duration-200">
          <Send className="w-4 h-4" />
          Add update
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-200">
          <MessageSquare className="w-4 h-4" />
          Comment
        </button>
      </section>
    </div>
  );
};

export default IssueDetail;
