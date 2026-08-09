# System File Map & Architecture Index

Comprehensive mapping of all source files across the client and server applications of **Humanity First Learning Hub**.

---

## 1. Client Architecture (`client/src/`)

### Entry & Core Setup
- **[main.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/main.jsx)**: Application mounting point. Wraps `App` inside `BrowserRouter` and Context Providers (`AuthProvider`, `LanguageProvider`, `BandwidthProvider`).
- **[App.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/App.jsx)**: Main routing table. Defines public, protected, and role-gated application routes.
- **[index.css](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/index.css)**: Global CSS design tokens, typography, glassmorphism utilities, and skeleton loaders.

### Pages (`client/src/pages/`)
- **[Login.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/pages/Login.jsx)**: Authentication interface supporting Login and Register modes with quick role-switcher tabs.
- **[Overview.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/pages/Overview.jsx)**: Main dashboard overview. Renders spotlight course hero, SVG progress ring, real-time metric cards, and next module CTA.
- **[CourseCatalog.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/pages/CourseCatalog.jsx)**: My Learning page. Lists all 8 orientation modules with completion badges, progress bar, progress reset, and trainer/admin CRUD modals.
- **[ModuleWorkspace.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/pages/ModuleWorkspace.jsx)**: Video workspace page. Displays YouTube video embed, low-bandwidth audio toggle, multi-paragraph study notes, key takeaways, and Knowledge Check trigger.
- **[CertificateView.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/pages/CertificateView.jsx)**: Verified certificate presentation view. Shows cryptographic ID, completion verification status, print layout, and shareable link generator.
- **[VerifyCertificate.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/pages/VerifyCertificate.jsx)**: Public credential verification portal for external auditors and employers.
- **[AdminDashboard.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/pages/AdminDashboard.jsx)**: Administration panel. Renders live MongoDB KPI summary cards, module performance analytics, user directory, and authenticated CSV report downloader.
- **[CommunityNoticeboard.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/pages/CommunityNoticeboard.jsx)**: Peer discussion noticeboard. Filters threads by category, renders replies, and triggers topic creation.

### Contexts (`client/src/context/`)
- **[AuthContext.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/context/AuthContext.jsx)**: Manages authentication state (`user`, `token`), localStorage persistence, login, logout, and token validation.
- **[BandwidthContext.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/context/BandwidthContext.jsx)**: Manages low-bandwidth mode toggle for field workers in low-connectivity areas.
- **[LanguageContext.jsx](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/context/LanguageContext.jsx)**: Manages multi-language translations (English, Hindi, Spanish, French).

### Services (`client/src/services/`)
- **[api.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/client/src/services/api.js)**: Centralized Axios instance with request interceptor attaching JWT Bearer tokens and response error handler.

### Components (`client/src/components/`)
- **Common**: `Badge.jsx`, `Button.jsx`, `MetricCard.jsx`, `ProtectedRoute.jsx`, `Toast.jsx`.
- **Layout**: `AppLayout.jsx`, `Sidebar.jsx`, `Topbar.jsx`.
- **Learner**: `QuizModal.jsx`.
- **Admin**: `ContentManager.jsx`, `QuizPerformance.jsx`, `UserDirectory.jsx`, `QuizEditorModal.jsx`.
- **Forum**: `NewTopicModal.jsx`, `ThreadDetailModal.jsx`.

---

## 2. Server Architecture (`server/`)

### Entry & Server Core
- **[server.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/server.js)**: Main server entry point. Configures Express CORS, JSON body parser, MongoDB connection (`MONGO_URI`), health check endpoint (`GET /api/health`), and API routes.

### Mongoose Models (`server/models/`)
- **[User.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/models/User.js)**: User schema with bcrypt password hashing hook and `matchPassword` method.
- **[Course.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/models/Course.js)**: Course schema referencing populated `Module` array.
- **[Module.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/models/Module.js)**: Module schema with title, fullContent, YouTube URL, and key takeaways.
- **[Quiz.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/models/Quiz.js)**: Quiz schema referencing `Module` ID with questions array and passing percentage.
- **[Progress.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/models/Progress.js)**: User progress schema tracking `completedModules`, `quizAttempts` history array, and certificate metadata.
- **[ForumPost.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/models/ForumPost.js)**: Forum thread schema with category, author reference, and replies array.

### Controllers (`server/controllers/`)
- **[authController.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/controllers/authController.js)**: `registerUser`, `loginUser`, `getMe`.
- **[courseController.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/controllers/courseController.js)**: `getCourses`, `getModuleById`, `addModule`, `updateModule`, `deleteModule`.
- **[quizController.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/controllers/quizController.js)**: `getQuizByModuleId`, `submitQuizAttempt`, `upsertQuizQuestions`.
- **[progressController.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/controllers/progressController.js)**: `getUserProgress`, `resetUserProgress`.
- **[adminController.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/controllers/adminController.js)**: `getAdminStats`, `getUsers`, `exportCSV`.
- **[forumController.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/controllers/forumController.js)**: `getForumPosts`, `createForumPost`, `addReply`, `deleteForumPost`.

### Routes (`server/routes/`)
- `authRoutes.js`, `courseRoutes.js`, `quizRoutes.js`, `progressRoutes.js`, `adminRoutes.js`, `forumRoutes.js`.

### Middleware & Utilities (`server/middleware/` & `server/utils/`)
- **[authMiddleware.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/middleware/authMiddleware.js)**: `protect` (verifies Bearer JWT) and `authorize` (role permissions).
- **[generateToken.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/utils/generateToken.js)**: Generates 30-day JWT tokens.
- **[seedData.js](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/server/utils/seedData.js)**: Database seed script initializing 3 official accounts, 8 modules, 8 quizzes, and 4 forum posts.
