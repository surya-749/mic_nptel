# NPTEL Prep — Understanding Incubation & Entrepreneurship

A retro pixel-art themed web application for students preparing for the NPTEL certification course **"Understanding Incubation & Entrepreneurship"**.

Built with **Next.js 16 (App Router)** and **React 19**.

---

## Features

- **120 Assignment Questions**: Weeks 1 to 12 weekly assignment quizzes with instant answer checking and detailed conceptual explanations.
- **4 Timed Mock Tests (45 Minutes each)**:
  - Full Mock Test 1 (All 12 Weeks — 30 MCQs)
  - Full Mock Test 2 (All 12 Weeks — 30 MCQs)
  - Mid-Term Mock Test (Weeks 1–6 — 30 MCQs)
  - End-Term Mock Test (Weeks 7–12 — 30 MCQs)
  - Interactive 30-button question palette (current, answered, not-answered tracking)
- **12 Weeks of Curated Study Materials**:
  - Exam Strategy Banner with direct lecture video links
  - Core Focus and Key Takeaway blocks per week
  - Key Topics badge lists
  - Notes, video lectures, and reference resources
- **Results & Performance Analytics**:
  - Score circular badge with animated grades (Excellent, Good, Keep Practising, Needs Improvement)
  - Breakdown: Correct, Incorrect, Skipped, and Time Taken
  - Full question review with user answers highlighted against correct answers and explanations
- **Professional Design & Responsiveness**:
  - Custom retro pixel-art sky aesthetic with floating clouds
  - Feather-style SVG icon system
  - 100% mobile-friendly responsive design for phones, tablets, and desktops
  - Offline progress persistence via `localStorage`

---

## Getting Started Locally

### Prerequisites

- Node.js 18+ (tested on Node v25)
- npm, pnpm, or yarn

### Installation

```bash
git clone https://github.com/surya-749/mic_nptel.git
cd mic_nptel
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Easy Deployment

### 1. Deploy on Vercel (Recommended — Zero Config)

1. Push your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Convert to Next.js web application"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New"** > **"Project"** and import `mic_nptel`.
4. Vercel automatically detects Next.js. Click **"Deploy"**.
5. Your app will be live with free global CDN and automatic HTTPS!

### 2. Deploy on Netlify

1. Import the repository in [Netlify](https://www.netlify.com/).
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Deploy!

---

## Project Structure

```
├── app/
│   ├── layout.js          # Root layout (TopBrand, Footer, BottomNav, Clouds)
│   ├── page.js            # Home page (Hero, Stats, Features, Overview, Quick Quiz)
│   ├── quizzes/page.js    # Assignment Quizzes (List + Interactive Quiz Mode)
│   ├── mock-tests/page.js # Mock Tests (List + Full 45-min Timed Exam Simulator)
│   ├── materials/page.js  # Study Materials (Strategy Banner + 12-Week Accordions)
│   ├── results/page.js    # Results Dashboard & Question-by-Question Review
│   └── globals.css        # Full responsive pixel-art retro stylesheet
├── components/
│   ├── TopBrand.jsx       # Header brand badge
│   ├── BottomNav.jsx      # Mobile & desktop 3D bottom floating menu
│   ├── PixelClouds.jsx    # Animated pixel clouds
│   ├── Footer.jsx         # Footer with course links
│   ├── UiIcon.jsx         # Feather-style SVG icon renderer
│   └── ToastContext.jsx   # Toast notification provider
├── data/
│   ├── questions.json     # 120 MCQs and 4 Mock Test definitions
│   └── materials.json     # 12 Weeks course syllabus, topics, and resources
├── lib/
│   ├── data.js            # Typed data helper functions
│   ├── icons.js           # SVG icon definitions
│   └── storage.js         # LocalStorage helpers and score grading
├── public/
│   ├── mic-logo.webp      # MIC logo
│   └── data/              # Public asset mirrors
├── jsconfig.json          # Path mapping (@/*)
├── next.config.mjs        # Next.js configuration
└── package.json           # Dependencies and build scripts
```
