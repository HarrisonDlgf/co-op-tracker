# 🐺 Co-Op Tracker Pro: Earn XP and Job Offers Simulatenously 🎮

Co-Op Tracker Pro turns the boring, sometimes rough Northeastern co-op search into a competitive, transparent, and gamified experience. I designed this to support, motivate, and empower students through one of the most overwhelming parts of college: thinking about your future.

**Co-Op Tracker is now live!** Link: https://co-op-tracker-orcin.vercel.app
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
| **Frontend** | React + Tailwind CSS    | UI/UX for dashboard, forms, social feed  |
| **Backend**  | Flask + SQLAlchemy      | REST API, XP logic, achievement engine   |
| **Database** | SQLite (dev) / PostgreSQL (prod) | Persist users, apps, offers, achievements |
| **Auth**     | Google OAuth + JWT      | Northeastern email login & user sessions |
| **Charts**   | Chart.js + react-chartjs-2 | Data visualization and analytics |
| **Hosting**  | Vercel (frontend), Render (backend) | Full deployment |

---

## Features

### ✅ **Completed Features**

#### **🔐 Authentication System**
- Google OAuth integration with Northeastern email validation
- JWT token-based session management
- Secure user authentication and authorization
- Automatic token refresh and session handling

#### **📊 Dashboard & Analytics**
- **XP Progress System**: Visual progress bar with level tracking
- **Application Status Pie Chart**: Interactive chart showing status breakdown
- **Statistics Cards**: Total applications, interviews, offers, achievements
- **Recent Applications**: Quick view of latest applications
- **Responsive Design**: Works on desktop, tablet, and mobile

#### **📝 Application Management**
- **Comprehensive Application Form**: Company, role, status, salary, notes
- **Application Table**: Sortable, filterable list of all applications
- **Status Tracking**: Applied, Interviewing, Offer, Rejected, Ghosted, Withdrawn
- **Edit & Update**: Modify application details and status
- **Search & Filter**: Find applications by company, status, or date

#### **🏆 Achievement System**
- **Dynamic Achievement Engine**: Unlock achievements based on user actions
- **Achievement Cards**: Visual display of earned and unearned achievements
- **Progress Tracking**: See progress towards unlocking achievements
- **XP Rewards**: Earn XP for completing achievements

#### **🥇 Leaderboard**: 
- **Dual Competition**: XP leaderboard and achievements leaderboard with top 25 rankings
- **Real-time Updates**: Live leaderboard with automatic refresh and last updated timestamps
- **Visual Recognition**: Trophy icons and special colors for top 3 positions (🥇 Gold, 🥈 Silver, 🥉 Bronze)
- **Personal Highlighting**: Current user's position highlighted with blue border and "You" badge
- **Profile Integration**: Shows user profile pictures, names, levels, and achievement counts
- **Competitive Analytics**: Displays XP totals, levels, and achievement counts for each competitor


#### 📥 Bulk Import System**
- **Multi-Format Support**: Import applications from CSV, Excel (.xlsx/.xls), and JSON files
- **Smart Data Processing**: Automatic status mapping and flexible date parsing for common formats
- **Duplicate Detection**: Prevents importing duplicate applications based on company, position, and date
- **Flexible Date Formats**: Supports multiple date formats (YYYY-MM-DD, MM/DD/YYYY, MM-DD-YYYY, etc.)
- **XP Integration**: Automatically awards XP for imported applications based on status
- **Template System**: Downloadable CSV template with sample data for easy formatting
- **Batch Processing**: Import hundreds of applications at once with progress tracking
- **Data Validation**: Required fields validation with helpful error messages for missing data

#### **🎮 Gamification**
- **XP System**: Earn XP for applications, interviews, and offers
- **Leveling System**: Level up every 100 XP with visual progress
- **Achievement Unlocking**: Complete milestones to unlock achievements
- **Progress Visualization**: See your growth over time

#### **🎨 User Experience**
- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS
- **Custom Favicon**: Branded browser tab icon
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Notifications**: Toast notifications for user feedback

### 🧪 **In Progress**
- **Offer Feed**: Public posts for accepted co-ops (role, pay, story)
- **Enhanced XP System**: Bonus XP for resume uploads, cover letters

### 🔮 **Planned Features**
- **Community Features**: Comments and upvotes on offers
- **Cycle Tracker**: View stats per cycle (Spring/Summer/Fall)
- **Badge Collection**: Visual achievement badges
- **Pay Transparency**: Detailed salary insights and comparisons

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v18+) - The frontend uses React 18.2.0 and modern React features
- Python (v3.11+)
- PostgreSQL  
- Google OAuth credentials - Required for authentication with Northeastern email validation

### **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

### **Environment Variables**
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (.env):**
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
```

**Frontend (.env):**
```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_API_URL=http://localhost:5001
```

---

## 📊 **Current Progress**

### **✅ MVP Complete (100%)**
- [x] User authentication with Google OAuth
- [x] Application tracking and management
- [x] XP and leveling system
- [x] Achievement system
- [x] Dashboard with analytics
- [x] Responsive UI/UX
- [x] Database integration
- [x] API endpoints
- [x] Leaderboard system
- [x] Production deployment

### **🔄 Next Phase (In Progress)**
- [ ] Offer Feed implementation
- [ ] Enhanced social features

---

## 🧠 **Who This Is For**

- 🧑‍🎓 **Northeastern students** applying for co-ops  
- 🧑‍💻 **Students who want structure** and momentum in their application process  
- 💸 **Students who want pay transparency** and offer insight before they commit
- 🎮 **Students who enjoy gamification** and tracking progress

---

## 🤝 **Contributing**

If you would like to contribute or fork this repository, please reach out beforehand. 

**Current Focus Areas:**
- Offer Feed development
  - System Design aspect to scale a safe message board for users
- Leaderboard implementation
- Production deployment
- Performance optimization

---

**Thanks, Harrison Dolgoff** 🚀
