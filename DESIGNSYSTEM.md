# SocioSphere Design System
## 1. Purpose
Single source of truth for SocioSphere UI.
All team members and AI tools must follow this file.
Do not introduce new colors, fonts, spacing, shadows, borders, or component styles without approval.

## 2. Design Direction
Style: Modern, premium, civic-tech, trustworthy, clean, futuristic, professional.
Theme: Dark dashboard aesthetic.
Priorities: Trust, community, transparency, safety, efficiency.
Avoid: Excessive gradients, neon colors, excessive glassmorphism, cartoonish UI, excessive animation, random colors, oversized text, excessive whitespace.

## 3. Typography
Primary Font: Plus Jakarta Sans
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Never introduce another font.

Display: 36–48px / 800 / 1.1
Page Heading: 28–32px / 800 / 1.2
Section Heading: 18–22px / 700
Card Heading: 14–18px / 700
Body: 14–15px / 400 / 1.5
Small: 12–13px
Micro: 10–11px
Labels: 11–12px / 600–700

## 4. Colors
### Background
Primary: #070B14
Secondary: #0B1120
Card: #0D1524
Elevated Card: #111A2B
Navbar: #080E1A

### Borders
Primary: #1E293B
Secondary: #243244
Subtle: rgba(148,163,184,0.12)

### Brand
Primary Emerald: #10B981
Light Emerald: #34D399
Dark Emerald: #059669

Use Emerald for primary actions, active navigation, success states, brand highlights, and primary CTAs.

### Accent Colors
Blue: #38BDF8
Purple: #8B5CF6
Amber: #F59E0B
Red: #F43F5E
Slate: #64748B

Blue: map, information, location and civic data.
Purple: community, analytics and special features.
Amber: warnings, maintenance and pending states.
Red: emergency, crime and critical issues.
Slate: secondary or neutral information.

## 5. Text Colors
Primary Text: #F8FAFC
Secondary Text: #CBD5E1
Muted Text: #94A3B8
Disabled Text: #64748B
Brand Text: #34D399

Never use pure white for large amounts of body text.

## 6. Spacing
Use Tailwind spacing consistently.
Preferred spacing: 4, 6, 8, 12, 16, 20, 24, 32.
Page horizontal padding:
Desktop: 24–32px
Tablet: 20–24px
Mobile: 16px

Avoid arbitrary spacing unless necessary.

## 7. Border Radius
Small: rounded-lg
Medium: rounded-xl
Large: rounded-2xl
Pills: rounded-full

Cards: rounded-2xl
Buttons: rounded-xl
Badges: rounded-full
Inputs: rounded-xl
Modals: rounded-2xl

## 8. Cards
Default:
bg-[#0D1524]
border border-slate-800
rounded-2xl

Cards should have subtle borders and minimal shadows.

Hover:
- Slight border-color change
- Slight background change
- Optional translate-y effect of 1–2px
- Transition duration around 200ms

Do not use excessive hover animations.

## 9. Buttons
Primary:
bg-emerald-500
text-slate-950
hover:bg-emerald-400

Secondary:
bg-slate-800
text-slate-200
border border-slate-700

Danger:
bg-rose-500/10
text-rose-300
border border-rose-500/30

Buttons must:
- Have clear hover states
- Have disabled states
- Use rounded-xl
- Use consistent padding
- Use Lucide icons when appropriate

## 10. Navigation
Navbar:
- Dark background
- Subtle bottom border
- Maximum content width
- Responsive
- Fixed/sticky where appropriate

Active navigation:
- Emerald accent
- Slight emerald background
- Clear visual distinction

Inactive navigation:
- Slate text
- Hover to lighter slate

Do not create different navbar designs for different pages.

## 11. Layout
Maximum content width:
80rem

Desktop:
Use centered content with consistent horizontal padding.

Tablet:
Reduce spacing while maintaining hierarchy.

Mobile:
Use single-column layouts.
Hide non-essential desktop navigation.
Use BottomNav where appropriate.
Cards must never cause horizontal scrolling.

## 12. Responsive Design
Every page must work on:
- Desktop
- Laptop
- Tablet
- Mobile

Never use fixed widths that cause horizontal overflow.
Prefer:
w-full
max-w-*
min-w-0
grid
flex
clamp()
responsive Tailwind breakpoints

Images must remain responsive.

## 13. Status Colors
Success/Resolved:
Emerald

In Progress:
Amber

Pending:
Amber

Critical:
Rose/Red

High:
Orange/Amber

Medium:
Blue

Low:
Slate

Do not randomly assign status colors.

## 14. Issue UI
Issue cards must consistently show:
- Category
- Priority
- Status
- Title
- Description
- Location
- Date/time
- ETA where available
- Image where available
- View Timeline action

Reuse:
IssueCard.jsx
IssueStatusBadge.jsx
IssueTimeline.jsx
AIAnalysisCard.jsx

Do not create duplicate issue components.

## 15. Community UI
Community components should use:
- Emerald for positive/community actions
- Purple for community features
- Blue for information

Reuse:
AnnouncementCard.jsx
DirectoryCard.jsx
EventCard.jsx
LostFoundCard.jsx

## 16. Finance UI
Finance components should use:
- Emerald for paid/completed
- Amber for pending/due
- Rose for overdue
- Blue for financial information

Reuse:
FeeCard.jsx
ExpenseCard.jsx
ExpenseChart.jsx
ProjectProgress.jsx

## 17. AI UI
AI features should feel advanced but remain consistent with the product.

Use:
- Emerald
- Blue
- Purple

AI components:
AIConfidence.jsx
AIInsight.jsx
AINetwork.jsx
AIAnalysisCard.jsx

Avoid excessive glowing effects.

## 18. Icons
Use Lucide React.
Do not use random icon libraries.
Icons should normally be:
16px–24px.

Use icons consistently for:
Navigation
Actions
Status
Location
Reports
Community
Finance
Security
Notifications

## 19. Images
Use images only when they add meaningful value.
Images should:
- Have rounded corners
- Use object-cover
- Maintain aspect ratio
- Never break layout

Do not use huge decorative images that push important content below the fold.

## 20. Animation
Animations should be subtle and purposeful.

Preferred:
- opacity transitions
- transform transitions
- hover elevation
- subtle pulse for live indicators
- smooth modal transitions

Avoid:
- excessive bouncing
- spinning elements
- constant motion
- distracting backgrounds

Standard transition:
transition-all duration-200

## 21. Forms
Inputs:
bg-slate-900
border border-slate-700
text-slate-100
placeholder:text-slate-500
rounded-xl

Focus:
border-emerald-500
ring-emerald-500/20

Every form must have:
- Label
- Input
- Validation state
- Error state where required
- Clear action button

## 22. Data Architecture
Pages must not contain large hardcoded datasets.

Use:
src/data/

Examples:
mockIssues.js
mockUsers.js
mockAnnouncements.js
mockFinance.js
mockCommunities.js
mockDirectory.js

Components receive data through props.

Future API integration must be possible without rewriting the UI.

## 23. Services
API logic belongs in:
src/services/

Examples:
api.js
authService.js
issueService.js
feeService.js
societyService.js
geminiService.js

Never place API/database logic directly inside UI components.

## 24. Context
Global state belongs in:
src/context/

AuthContext:
User authentication and role.

SocietyContext:
Current society/colony.

ThemeContext:
Theme preferences.

Do not create duplicate global state systems.

## 25. Components
Before creating a component, check whether an existing reusable component can be used.

Existing component categories:
components/ui/
components/layout/
components/issue/
components/community/
components/dashboard/
components/fees/
components/map/
components/ai/

Never create:
ProblemCard if IssueCard already exists.
CustomButton if Button already exists.
CustomBadge if Badge already exists.

## 26. Page Structure
Pages should focus on composing components.

Recommended structure:
Page Container
→ Header
→ Summary/Stats
→ Main Content
→ Supporting Content
→ Actions

Avoid putting large reusable UI blocks directly into pages.

## 27. Citizen Pages
Citizen experience should prioritize:
- Quick actions
- Issue reporting
- Issue tracking
- Community
- Map
- Announcements
- Maintenance
- Finance
- Profile

Primary CTA should generally use Emerald.

## 28. Authority Pages
Authority experience should prioritize:
- Dashboard
- Issues
- Analytics
- Members
- Directory
- Expenses
- Fees
- Announcements

Authority interfaces should be data-rich but organized.

## 29. Public Pages
Public pages should prioritize:
- Product explanation
- Society discovery
- Colony preview
- Registration
- Login
- How SocioSphere works

Public pages may use slightly more visual storytelling while maintaining the same design system.

## 30. Accessibility
Use:
- Semantic HTML
- Accessible buttons
- Proper labels
- Keyboard-friendly controls
- Sufficient color contrast
- aria-label when necessary

Never rely only on color to communicate status.

## 31. AI Coding Rules
Every AI coding tool must:
1. Read this file before modifying UI.
2. Inspect existing components first.
3. Reuse existing components.
4. Follow the existing folder structure.
5. Follow the exact color system.
6. Follow the exact typography system.
7. Follow responsive rules.
8. Avoid unnecessary dependencies.
9. Avoid duplicate components.
10. Avoid changing unrelated files.
11. Keep mock data separate from UI.
12. Keep API logic separate from UI.
13. Test the page after implementation.
14. Fix compilation errors before finishing.

## 32. File Ownership Rule
Do not modify another team member's page without permission.

Shared files require team-lead approval:
- App.jsx
- main.jsx
- index.css
- DESIGNSYSTEM.md
- routing configuration
- shared layouts
- shared UI components

## 33. Final UI Rule
Every SocioSphere page must look like it belongs to the same application.

When uncertain between two design choices:
1. Prefer consistency.
2. Reuse an existing component.
3. Follow the existing color system.
4. Follow the existing typography.
5. Keep the interface simple.
6. Ask the team lead before introducing a new pattern.