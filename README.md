# 🧠 Co-Op Tracker Pro: Ranked Mode 🎮

_“Applying to jobs is the game. Your career is the prize.”_

Co-Op Tracker Pro turns the Northeastern co-op search into a competitive, transparent, and gamified experience — designed to support, motivate, and empower students through one of the most overwhelming parts of college: getting that next opportunity.

---

## 🚀 Vision

Co-Op Tracker Pro isn’t just a tracker — it’s a platform. Built for students who are grinding through 100+ applications, refreshing NUworks at midnight, and writing cover letters for the 10th time — this app makes that process **fun, social, and transparent, and most importantly ranked**.

### 🔥 Core Goals

- **Ranked applications**: Earn XP for applying, writing cover letters, and moving forward in the process
- **Gamified progress**: Level up, unlock achievements, and track your growth across co-op cycles
- **Student transparency**: Offer a real-time feed of co-op offers with roles, pay, and insight for wage visibility
- **Community support**: Comment, upvote, and celebrate your peers’ wins

---

## 🧱 Tech Stack

| Layer        | Technology              | Purpose                                  |
|--------------|--------------------------|------------------------------------------|
| **Frontend** | React (Tailwind/Bootstrap) | UI/UX for dashboard, forms, social feed  |
| **Backend**  | Flask                    | REST API, XP logic, achievement engine   |
| **Database** | SQLite → PostgreSQL      | Persist users, apps, offers, achievements |
| **Auth**     | Firebase Auth (planned)  | Northeastern email login & user sessions |
| **Hosting**  | (planned) Vercel (frontend), Render/Fly.io (backend) | Full deployment |

---

## ✨ Features

### ✅ MVP (Completed)
- 🔁 Application logging with:
  - Company, role, status, wage, hybrid type
  - Cover letter, benefits (optional)
- 🧠 XP system with per-status rewards:
  - +10 for Applied, +20 for Interviewing, +50 for Offer
- 🧗 Leveling system: Level up every 100 XP
- 🏅 Achievement engine:
  - First app, 10 apps, 5 interviews, 1 offer, level 2, 500 XP
- 📊 User profile:
  - Interview rate, offer rate, total XP, level, achievements
- ✏️ Application update support (with XP recalibration)

### 🧪 In Progress
- 🔐 Firebase email auth (NEU only)
- 🧾 SQLite persistence with SQLAlchemy
- 🎨 React frontend MVP
  - Dashboard (XP bar, stats)
  - Application table + form
  - Achievement cards

### 🔮 Planned
- 🏆 Offer Feed:
  - Public posts for accepted co-ops (role, pay, emoji, story)
- 🔥 Leaderboard:
  - Top XP earners across NEU
- 💌 Bonus XP:
  - Add resume, write a cover letter, and more for leveling up
- 🧭 Cycle Tracker:
  - View stats per cycle (Spring/Summer/Fall)
- 📥 CSV export/import
- 🎖 Badge collection
- 💬 Comments + upvotes on offers

---

## 📸 Screenshots (Coming Soon)

- Dashboard with XP bar + level
- Application log and form
- Offer feed UI
- Achievement badges

---

## 🧠 Who This Is For

- 🧑‍🎓 Northeastern students applying for Spring or Fall co-ops  
- 🧑‍💻 Students who want structure and momentum in their application process  
- 💸 Students who want pay transparency and offer insight before they commit

---

## 🛠 Setup Instructions

1. Clone the repo  
2. Create a virtual environment and activate it  
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
