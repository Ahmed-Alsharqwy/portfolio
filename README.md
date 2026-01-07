# 🕸️ Modern Cyber Security Portfolio

A professional, high-performance, and secure portfolio website designed with a **Cyberpunk/Hacker aesthetic**. This project features a dynamic Matrix background, multi-theme support, and a cloud-synced Admin Panel using **Firebase Realtime Database**.

---

## 🚀 Live Features

### 🎨 Visuals & UI/UX
- **Matrix Rain Background**: A real-time canvas animation that syncs its color with the active theme.
- **Multi-Theme Switcher**: Cycle through **Neon Green**, **Cyber Blue**, **Glitch Red**, and **Vivid Purple** themes. Preference is saved locally.
- **Cyber-Beam Navbar**: A sleek navigation bar with a neon glow border and a "beam" effect on hover.
- **Glitch Text Effects**: Professional hacking-style glitch animations for headings.
- **Typewriter Effect**: Dynamic typing effect for the hero section subtitles.

### 🛠️ Admin & Content Management
- **Hidden Admin Login**: 
  - Access is hidden for security. **Click the Copyright notice 3 times** to prompt for the password.
  - Default Password: `admin` (Configurable in `script.js`).
- **Real-time Updates**: Add, Edit, or Delete projects, skills, and certifications without touching the code.
- **Image Optimizer**: Built-in client-side compression (Canvas API) that resizes images before uploading to Firebase to ensure fast loading and database efficiency.
- **Profile & CV Manager**: Upload a new profile picture or a CV directly from the admin interface.

### 📱 Performance & Compatibility
- **Full Responsiveness**: Optimized for Mobile (Phone), Tablet, and Desktop displays.
- **No-Build Setup**: Pure Vanilla JS, HTML, and CSS. No `node_modules` or complex build steps required.
- **Firebase Integration**: Uses Firebase Realtime Database for zero-cost hosting and persistence.

---

## 🛠️ Technical Stack

- **Structure**: Semantic HTML5
- **Style**: Custom CSS3 Variables (Design System)
- **Logic**: Vanilla JavaScript (ES6+)
- **Database**: Firebase Realtime Database (v10 compat SDK)
- **Icons**: FontAwesome 6

---

## ⚙️ Setup & Installation

1. **Clone/Download** the repository.
2. **Firebase Configuration**:
   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable **Realtime Database**.
   - Copy your configuration into the `firebaseConfig` object in `script.js`.
3. **Database Rules**:
   - For development, you can set `.read` and `.write` to `true`.
   - **IMPORTANT FOR PRODUCTION**: Set rules to prevent unauthorized writing:
     ```json
     {
       "rules": {
         ".read": true,
         ".write": "auth != null"
       }
     }
     ```
4. **Run Locally**: Simply open `index.html` in your browser.

---

## 🔐 Security Best Practices

1. **Output Sanitization**: The system uses `textContent` for rendering user-submitted data to prevent **XSS (Cross-Site Scripting)**.
2. **Password Protection**: The admin panel is hidden and requires a password. For higher security, consider integrating **Firebase Auth**.
3. **Database Hardening**: Always verify Firebase Security Rules before sharing your link.

---

## 📁 Project Structure

- `index.html`: Main document structure.
- `style.css`: All styling, including theme variables and media queries.
- `script.js`: Firebase logic, animations, theme management, and UI logic.
- `images/`: Local static assets (e.g., fallback profile picture).

---

Developed with 💚 for **Ahmed Elsayed**.
