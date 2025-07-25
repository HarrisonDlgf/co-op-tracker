# 🧠 Co-Op Tracker Pro: Earn XP and Job Offers Simulatenously 🎮

Co-Op Tracker Pro turns the boring, sometimes rough Northeastern co-op search into a competitive, transparent, and gamified experience. I designed this to support, motivate, and empower students through one of the most overwhelming parts of college: thinking about your future.

---

## 🚀 Vision

Co-Op Tracker Pro isn’t just to be a spreadsheet but to be a platform for all. Created for students who are grinding through 100+ applications, refreshing NUworks at midnight, and writing cover letters over and over again, this site makes that process **fun, social, and transparent, and most importantly a game**.

### 🔥 Core Goals

- **Earn XP for applications**: Earn XP for applying, writing cover letters, and moving forward in the process
- **Gamified progress**: Level up, unlock achievements, and track your growth across co-op cycles
- **Student transparency**: Offer a real-time feed of co-op offers with roles, pay, and insight for wage visibility
- **Community support**: Comment, upvote, and celebrate your peers’ wins

---

## 🧱 Tech Stack

| Layer        | Technology              | Purpose                                  |
|--------------|--------------------------|------------------------------------------|
| **Frontend** | React (Tailwind/Bootstrap) | UI/UX for dashboard, forms, social feed  |
| **Backend**  | Flask                    | REST API, XP logic, achievement engine   |
| **Database** | SQLAlchemy               | Persist users, apps, offers, achievements |
| **Auth** (PLANNED)     | Firebase Auth (planned)  | Northeastern email login & user sessions |
| **Hosting** (PLANNED) | (planned) Vercel (frontend), Render/Fly.io (backend) | Full deployment |

---

## Features

### ✅ MVP for Backend (Completed)
- 🔁 Application logging with:
  - Company, role, status, wage, hybrid type
  - Cover letter, benefits (optional)
- 🧠 XP system with per-status rewards:
  - +10 for Applied, +20 for Interviewing, +50 for Offer
- 🧗 Leveling system: Level up every 100 XP
- 🏅 Achievement engine:
  - Achievements given based on criteria being met in a user's profile
- 📊 User profile:
  - Interview rate, offer rate, total XP, level, achievements
  - Models created and connected to a DB

### 🧪 In Progress
- 🔐 Firebase email auth (NEU only)
- 🧾 SQLite persistence with SQLAlchemy
- 🎨 React frontend MVP
  - Dashboard (XP bar, stats)
  - Application table + form
  - Achievement cards

### 🔮 Planned
- Offer Feed:
  - Public posts for accepted co-ops (role, pay, emoji, story)
-  Leaderboard:
  - Top XP earners across NEU
- 💌 Bonus XP:
  - Add resume, write a cover letter, and more for leveling up
- Cycle Tracker:
  - View stats per cycle (Spring/Summer/Fall)
- 📥 CSV export/import
- 🎖 Badge collection
- 💬 Comments + upvotes on offers

---

## 🧠 Who This Is For

- 🧑‍🎓 Northeastern students applying for co-ops  
- 🧑‍💻 Students who want structure and momentum in their application process  
- 💸 Students who want pay transparency and offer insight before they commit

---

If you would like to contribute or fork this repository, please reach out beforehand. 
Thanks, Harrison Dolgoff
