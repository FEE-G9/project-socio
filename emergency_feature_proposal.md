# Feature Proposal: Bidirectional Emergency SOS & Broadcast System

## Overview
We are adding a "Live Command Center" feature to SocioSphere to handle emergencies. Since our app has two distinct roles (Citizens and Admins), this feature will act as a real-time, two-way alarm system between them.

1. **Citizen ➔ Admin (Individual SOS):** If a citizen witnesses a crime or faces a critical emergency, they can press an SOS button. This instantly triggers a flashing red alarm on the Admin's dashboard.
2. **Admin ➔ Citizen (Mass Broadcast):** If the Admin detects a society-wide emergency (e.g., Fire in Block B, Security Breach), they can broadcast a "Red Alert." This forces a massive warning overlay to appear on the screens of all active Citizens.

## Why are we building this?
* **The "Wow" Factor for Presentation:** During our final presentation, we can open the Admin dashboard and the Citizen dashboard side-by-side on the projector. Triggering an alarm on one side and watching the other screen flash red instantly will look incredibly impressive.
* **Completes the Ecosystem:** A society management app isn't just about paying fees; real-time safety is the most critical feature.

---

## Technical Approach (How it works without a backend)
Since we don't have a live WebSocket server to push real-time events, we will use a clever React trick: **Cross-Tab Local Storage Events**. 

When a user triggers an alarm, we will write a small JSON object to the browser's `localStorage` (e.g., `sociosphere_alert`). Modern browsers fire a `storage` event across all other open tabs whenever `localStorage` changes. We can create a global React Context (`AlertContext.jsx`) that listens to this event and instantly triggers the UI on the other side.

---

## Division of Labor

### 👨‍💻 Admin Side (Our Team)
**1. Broadcast Trigger UI:**
* Build a "Broadcast Emergency" button/modal on the `AdminHome` dashboard. 
* Admins can select the type of emergency (Fire, Security, Medical) and type a quick message, then hit "Send".

**2. SOS Receiver UI:**
* Build a pulsing/flashing red component that pops up on the Admin screen when a Citizen triggers an SOS.
* It should display the Citizen's name, their block/apartment, and have an "Acknowledge / Dispatch Security" button to stop the alarm.

### 👨‍💻 Citizen Side (Your Team)
**1. SOS Trigger UI:**
* Add a highly visible "SOS" or "Emergency" button for the citizen (ideally in the Navbar or floating on the Citizen Dashboard so it's always accessible).
* When clicked, it should ask for a quick confirmation ("Trigger Emergency SOS?") and then fire the event to the Admin.

**2. Broadcast Receiver UI:**
* Build a full-screen, high-z-index overlay (a "Red Alert" screen).
* When the Admin sends a broadcast, this overlay must pop up and take over the Citizen's screen, showing the Admin's warning message and requiring the citizen to click "I Understand / Safe" to dismiss it.

---

## Next Steps
1. We will set up the shared `AlertContext.jsx` file that handles the `localStorage` logic.
2. You build the Citizen UI components (The SOS Button and the Red Alert Overlay).
3. We will build the Admin UI components (The Broadcast Button and the SOS Receiver Dashboard).
4. We integrate them into the main Layout files and test them side-by-side!
