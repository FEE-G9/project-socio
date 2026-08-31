# SocioSphere
SocioSphere is a smart society/community management platform that connects citizens, society authorities, and communities through one unified digital platform.
## Project Status
Current Phase: Frontend MVP
Future Phase: Full Stack Application
## Tech Stack
React + Vite
Tailwind CSS
React Router
Lucide React
Axios
Mock Data
Future Backend: Express.js + MongoDB + Mongoose + JWT
## Core Idea
SocioSphere allows residents to report and track civic issues, report crimes, view announcements and events, interact with their community, view maps, manage maintenance charges, understand society expenses, and access important society services. Authorities can manage issues, residents, fees, expenses, announcements, directories, members, and analytics.
## User Roles
### Public
- Explore SocioSphere
- Discover societies/colonies
- View colony information
- Register a colony
- Login
- Learn how the platform works
### Citizen
- Home
- Dashboard
- Report civic issues
- Report crimes
- Track reported issues
- View issue timeline
- View map
- Community interaction
- Announcements and events
- Maintenance fees
- Society expenses
- Profile
### Authority
- Authority dashboard
- Issue management
- Analytics
- Member management
- Directory management
- Maintenance fee management
- Expense management
- Announcement management
## Pages
### Public
- Landing.jsx
- Colonies.jsx
- ColonyPreview.jsx
- RegisterColony.jsx
- Login.jsx
- HowItWorks.jsx
### Citizen
- Home.jsx
- Dashboard.jsx
- Profile.jsx
- IssueDetail.jsx
- Report.jsx
- ReportCrime.jsx
- Map.jsx
- Community.jsx
- Announcements.jsx
- Fees.jsx
- Expenses.jsx
### Authority
- Admin.jsx
- Analytics.jsx
- Issues.jsx
- ManageFees.jsx
- ManageExpenses.jsx
- ManageDirectory.jsx
- PostAnnouncement.jsx
- Members.jsx
## Project Structure
src/
├── components/
│   ├── ai/
│   ├── community/
│   ├── dashboard/
│   ├── fees/
│   ├── issue/
│   ├── layout/
│   ├── map/
│   └── ui/
├── context/
├── data/
├── hooks/
├── pages/
│   ├── public/
│   ├── citizen/
│   └── authority/
├── services/
├── utils/
├── types/
├── App.jsx
├── main.jsx
└── index.css
## Shared Components
### Layout
Navbar.jsx
CitizenLayout.jsx
AuthorityLayout.jsx
PublicLayout.jsx
Sidebar.jsx
BottomNav.jsx
### UI
Button.jsx
Card.jsx
Badge.jsx
Modal.jsx
Spinner.jsx
EmptyState.jsx
StatCard.jsx
### Issue
IssueCard.jsx
IssueStatusBadge.jsx
IssueTimeline.jsx
AIAnalysisCard.jsx
### Community
AnnouncementCard.jsx
DirectoryCard.jsx
EventCard.jsx
LostFoundCard.jsx
### Finance
FeeCard.jsx
ExpenseCard.jsx
ExpenseChart.jsx
ProjectProgress.jsx
### Dashboard
QuickActions.jsx
IssueStats.jsx
CommunityHealth.jsx
ActivityFeed.jsx
Shared components must be reused. Do not create duplicate components.
## Design System
The complete UI rules are defined in DESIGNSYSTEM.md.
Font: Plus Jakarta Sans
Theme: Dark civic-tech
Primary Background: #070B14
Secondary Background: #0B1120
Card Background: #0D1524
Elevated Card: #111A2B
Border: #1E293B
Primary Brand: #10B981
Light Brand: #34D399
Blue: #38BDF8
Purple: #8B5CF6
Amber: #F59E0B
Red: #F43F5E
Primary Text: #F8FAFC
Secondary Text: #CBD5E1
Muted Text: #94A3B8
All pages must follow the same typography, colors, spacing, cards, buttons, navigation, border radius, animations, and responsive behaviour.
## Data
Current frontend uses mock data stored in src/data/.
Examples:
- mockIssues.js
- mockUsers.js
- mockAnnouncements.js
- mockFinance.js
- mockCommunities.js
- mockDirectory.js
Do not place large datasets directly inside page components.
## Future Backend
The frontend will later connect to an Express.js + MongoDB backend.
React
↓
Axios
↓
Express.js API
↓
Controllers
↓
Services
↓
MongoDB
API logic will belong inside src/services/.
Examples:
- api.js
- authService.js
- issueService.js
- feeService.js
- societyService.js
UI components must remain independent of the database.
## Git Workflow
The main branch is the stable branch. Every team member must create and use their own branch. Do not directly work on main.
git pull origin main
git checkout -b feature/person1-citizen
Branch examples:
feature/person1-citizen
feature/person2-actions
feature/person3-public-finance
feature/person4-authority
After completing work:
git status
git add .
git commit -m "feat: add page-name"
git push origin branch-name
Create a Pull Request for review before merging into main.
## Team Responsibilities
### Person 1 — Citizen Core
- Home
- Dashboard
- Profile
- IssueDetail
- HowItWorks
- Main integration and routing
### Person 2 — Citizen Actions
- Report
- ReportCrime
- Map
- Community
- Announcements
### Person 3 — Public + Finance
- Landing
- Colonies
- ColonyPreview
- RegisterColony
- Login
- Fees
- Expenses
### Person 4 — Authority
- Admin
- Analytics
- Issues
- ManageFees
- ManageExpenses
- ManageDirectory
- PostAnnouncement
- Members
## Development Rules
1. Read DESIGNSYSTEM.md before coding.
2. Inspect existing components before creating new ones.
3. Reuse existing components.
4. Do not create duplicate components.
5. Do not change global styling without approval.
6. Do not modify another member's pages.
7. Do not directly modify main.
8. Keep mock data inside src/data/.
9. Keep API logic inside src/services/.
10. Keep reusable logic inside src/hooks/.
11. Keep pages focused on UI composition.
12. Make every page responsive.
13. Avoid unnecessary dependencies.
14. Test before committing.
15. Inform the team before changing shared files.
## AI Development Rules
AI tools will be used to generate and modify code.
Recommended workflow:
Stitch → UI/Design Reference
↓
Claude / Google AI Studio → Initial React Implementation
↓
Codex in VS Code → Integration + Debugging + Refactoring
↓
npm run dev → Testing
↓
Git Commit
Every AI coding prompt should include:
"First inspect the existing React project. Do not create a new project. Read DESIGNSYSTEM.md. Follow the existing folder structure. Reuse existing components. Do not create duplicate components. Do not change unrelated files. Keep the page responsive. Use existing mock data. Keep the implementation ready for future Express.js + MongoDB API integration."
## Running the Project
Install dependencies:
npm install
Start development server:
npm run dev
Build:
npm run build
Preview:
npm run preview
## 10-Day Development Plan
Day 1: Project setup, Git branches, design system, shared components, layouts, and main page foundations.
Days 2–3: Build assigned primary pages.
Days 4–5: Complete remaining pages and frontend interactions.
Day 6: Integrate React Router, Navbar, layouts, and navigation.
Day 7: Connect mock data and improve functionality.
Day 8: Responsive testing and bug fixing.
Day 9: Complete demo flow, polish UI, and deployment.
Day 10: Final testing, PPT, and demo practice.
## Final Demo Flow
Public Landing
↓
Login
↓
Citizen Home
↓
Report Issue
↓
AI Analysis
↓
Issue Created
↓
Authority Dashboard
↓
Authority Views Issue
↓
Authority Updates Status
↓
Citizen Tracks Issue
↓
Issue Resolved
## Future Scope
- Express.js backend
- MongoDB database
- JWT authentication
- Role-based access control
- Real-time issue updates
- AI-powered issue classification
- AI-based priority detection
- Smart society analytics
- Online maintenance payments
- Expense transparency
- Notifications
- Real-time community communication
- Cloud image storage
- Production deployment
## Goal
Build a visually impressive, responsive, AI-assisted society management platform with 25+ connected pages while maintaining one consistent design language and a backend-ready architecture.