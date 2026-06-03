import type {
  User, Task, FocusSession, MoodEntry, ReflectionEntry, Habit, Goal,
  WellbeingLog, Notification, EngagementMetrics, StudentDashboardStats,
  AdminDashboardStats, Course, Section,
} from "@/types";

// ── Demo Users ──────────────────────────────────────────────
export const DEMO_USERS: Record<string, User> = {
  student: {
    id: "demo-student-1",
    email: "student@kku.ac.th",
    displayName: "พิมพ์ใจ รักเรียน",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=PJ&backgroundColor=6366f1",
    role: "student",
    department: "วิทยาการคอมพิวเตอร์",
    faculty: "วิทยาศาสตร์และเทคโนโลยี",
    studentId: "6601234567",
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date(),
    privacySettings: { reflectionsVisible: false, analyticsShared: true, wellbeingShared: true, focusDataShared: true },
    language: "th",
    isActive: true,
  },
  teacher: {
    id: "demo-teacher-1",
    email: "teacher@kku.ac.th",
    displayName: "ผศ.ดร. วรรณภา สอนดี",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=WS&backgroundColor=0d9488",
    role: "teacher",
    department: "วิทยาการคอมพิวเตอร์",
    faculty: "วิทยาศาสตร์และเทคโนโลยี",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date(),
    privacySettings: { reflectionsVisible: false, analyticsShared: false, wellbeingShared: false, focusDataShared: false },
    language: "th",
    isActive: true,
  },
  psychologist: {
    id: "demo-psych-1",
    email: "psych@kku.ac.th",
    displayName: "ดร. สุขสันต์ ใจดี",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NK&backgroundColor=7c3aed",
    role: "psychologist",
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date(),
    privacySettings: { reflectionsVisible: false, analyticsShared: false, wellbeingShared: false, focusDataShared: false },
    language: "th",
    isActive: true,
  },
  super_admin: {
    id: "demo-admin-1",
    email: "admin@kku.ac.th",
    displayName: "ผู้ดูแลระบบหลัก",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=SA&backgroundColor=dc2626",
    role: "super_admin",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date(),
    privacySettings: { reflectionsVisible: false, analyticsShared: false, wellbeingShared: false, focusDataShared: false },
    language: "th",
    isActive: true,
  },
};

// ── Student Dashboard Stats ──────────────────────────────────
export const DEMO_STUDENT_STATS: StudentDashboardStats = {
  todayFocusMinutes: 95,
  weeklyFocusMinutes: 520,
  tasksCompletedToday: 4,
  tasksTotal: 9,
  currentStreak: 7,
  reflectionCompletedToday: false,
  currentMood: 4,
  wellbeingScore: 78,
  productivityScore: 82,
  weeklyGoalProgress: 65,
};

// ── Tasks ────────────────────────────────────────────────────
export const DEMO_TASKS: Task[] = [
  {
    id: "t1", userId: "demo-student-1",
    title: "ส่งรายงาน Algorithm Analysis", description: "บทที่ 3 - Sorting Algorithms",
    priority: "high", status: "in_progress", category: "academic",
    dueDate: new Date(Date.now() + 86400000), estimatedMinutes: 120, actualMinutes: 45,
    tags: ["CS301", "homework"], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "t2", userId: "demo-student-1",
    title: "อ่านหนังสือ Data Structures Chapter 8", description: "",
    priority: "medium", status: "todo", category: "academic",
    dueDate: new Date(Date.now() + 172800000), estimatedMinutes: 90, actualMinutes: 0,
    tags: ["CS302"], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "t3", userId: "demo-student-1",
    title: "ออกกำลังกาย 30 นาที", description: "",
    priority: "medium", status: "completed", category: "health",
    dueDate: new Date(), estimatedMinutes: 30, actualMinutes: 35,
    tags: ["health"], createdAt: new Date(), updatedAt: new Date(), completedAt: new Date(),
  },
  {
    id: "t4", userId: "demo-student-1",
    title: "ประชุมกลุ่ม Software Engineering Project",
    priority: "high", status: "completed", category: "academic",
    dueDate: new Date(), estimatedMinutes: 60, actualMinutes: 75,
    tags: ["CS401", "group"], createdAt: new Date(), updatedAt: new Date(), completedAt: new Date(),
  },
  {
    id: "t5", userId: "demo-student-1",
    title: "ทำ Math Homework Set 5", description: "Linear Algebra",
    priority: "urgent", status: "todo", category: "academic",
    dueDate: new Date(Date.now() + 43200000), estimatedMinutes: 60,
    tags: ["MATH201"], createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "t6", userId: "demo-student-1",
    title: "จดบันทึกสะท้อนคิดประจำวัน",
    priority: "low", status: "todo", category: "personal",
    dueDate: new Date(), estimatedMinutes: 15,
    tags: ["reflection"], createdAt: new Date(), updatedAt: new Date(),
  },
];

// ── Focus Sessions ────────────────────────────────────────────
export const DEMO_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: "f1", userId: "demo-student-1", type: "pomodoro", status: "completed",
    plannedMinutes: 25, actualMinutes: 25, breakMinutes: 5,
    distractionCount: 2, flowScore: 72, qualityScore: 78,
    notes: "Working on Algorithm report",
    startedAt: new Date(Date.now() - 3600000), endedAt: new Date(Date.now() - 3000000),
    createdAt: new Date(),
  },
  {
    id: "f2", userId: "demo-student-1", type: "deep_work", status: "completed",
    plannedMinutes: 60, actualMinutes: 70, breakMinutes: 10,
    distractionCount: 0, flowScore: 91, qualityScore: 95,
    startedAt: new Date(Date.now() - 7200000), endedAt: new Date(Date.now() - 3600000),
    createdAt: new Date(),
  },
];

// ── Mood Entries ─────────────────────────────────────────────
export const DEMO_MOOD_ENTRIES: MoodEntry[] = [
  { id: "m1", userId: "demo-student-1", mood: 4, energy: 4, emotions: ["มีแรงบันดาลใจ", "มีสมาธิ"], recordedAt: new Date(), createdAt: new Date() },
  { id: "m2", userId: "demo-student-1", mood: 3, energy: 3, emotions: ["เหนื่อย", "พอใจ"], recordedAt: new Date(Date.now() - 86400000), createdAt: new Date(Date.now() - 86400000) },
  { id: "m3", userId: "demo-student-1", mood: 4, energy: 5, emotions: ["มีความสุข", "ตื่นเต้น"], recordedAt: new Date(Date.now() - 172800000), createdAt: new Date(Date.now() - 172800000) },
  { id: "m4", userId: "demo-student-1", mood: 2, energy: 2, emotions: ["เครียด", "กังวล"], recordedAt: new Date(Date.now() - 259200000), createdAt: new Date(Date.now() - 259200000) },
  { id: "m5", userId: "demo-student-1", mood: 5, energy: 4, emotions: ["รู้สึกขอบคุณ", "สงบ"], recordedAt: new Date(Date.now() - 345600000), createdAt: new Date(Date.now() - 345600000) },
  { id: "m6", userId: "demo-student-1", mood: 4, energy: 3, emotions: ["มีสมาธิ", "พอใจ"], recordedAt: new Date(Date.now() - 432000000), createdAt: new Date(Date.now() - 432000000) },
  { id: "m7", userId: "demo-student-1", mood: 3, energy: 4, emotions: ["มีแรงบันดาลใจ"], recordedAt: new Date(Date.now() - 518400000), createdAt: new Date(Date.now() - 518400000) },
];

// ── Reflections ───────────────────────────────────────────────
export const DEMO_REFLECTIONS: ReflectionEntry[] = [
  {
    id: "r1", userId: "demo-student-1", type: "daily",
    prompt: "วันนี้คุณได้เรียนรู้อะไร?",
    content: "วันนี้เรียนเรื่อง Merge Sort และ Quick Sort ทำให้เข้าใจเรื่อง time complexity มากขึ้น รู้สึกว่าตัวเองเข้าใจ recursion ได้ดีขึ้นมากเลย",
    gratitude: ["อาจารย์อธิบายได้ดีมาก", "เพื่อนช่วยอธิบาย", "มีสุขภาพดี"],
    aiInsight: "ดูเหมือนวันนี้มีความก้าวหน้าในการเรียนรู้เรื่อง algorithms มาก การเข้าใจ recursion ถือเป็นก้าวสำคัญ ลองสังเกตดูว่าสภาพแวดล้อมแบบไหนที่ช่วยให้เข้าใจได้ดีที่สุด",
    isPrivate: false, mood: 4,
    createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "r2", userId: "demo-student-1", type: "weekly",
    content: "สัปดาห์นี้ค่อนข้างหนัก แต่ก็ผ่านมาได้ ได้เรียนรู้เรื่อง algorithms เยอะมาก และมีโอกาสได้ทำงานกลุ่มกับเพื่อนๆ ความท้าทายคือการจัดการเวลา",
    aiInsight: "จากการสะท้อนคิดประจำสัปดาห์ แสดงให้เห็นถึงความยืดหยุ่นและความมุ่งมั่น การทำงานเป็นทีมและการเรียนรู้อย่างกระตือรือร้นเป็นจุดแข็งที่ชัดเจน",
    isPrivate: false, mood: 3,
    createdAt: new Date(Date.now() - 259200000), updatedAt: new Date(Date.now() - 259200000),
  },
];

// ── Habits ────────────────────────────────────────────────────
export const DEMO_HABITS: Habit[] = [
  { id: "h1", userId: "demo-student-1", title: "ออกกำลังกาย", frequency: "daily", targetCount: 1, currentStreak: 7, longestStreak: 14, completionDates: [], color: "#14b8a6", icon: "🏃", isActive: true, createdAt: new Date() },
  { id: "h2", userId: "demo-student-1", title: "อ่านหนังสือ 30 นาที", frequency: "daily", targetCount: 1, currentStreak: 4, longestStreak: 10, completionDates: [], color: "#6366f1", icon: "📚", isActive: true, createdAt: new Date() },
  { id: "h3", userId: "demo-student-1", title: "สะท้อนคิดประจำวัน", frequency: "daily", targetCount: 1, currentStreak: 6, longestStreak: 6, completionDates: [], color: "#f97316", icon: "✍️", isActive: true, createdAt: new Date() },
  { id: "h4", userId: "demo-student-1", title: "นอนก่อน 23:00 น.", frequency: "daily", targetCount: 1, currentStreak: 3, longestStreak: 12, completionDates: [], color: "#7c3aed", icon: "😴", isActive: true, createdAt: new Date() },
];

// ── Goals ─────────────────────────────────────────────────────
export const DEMO_GOALS: Goal[] = [
  {
    id: "g1", userId: "demo-student-1", title: "เกรดเฉลี่ยไม่ต่ำกว่า 3.5 เทอมนี้",
    category: "academic", status: "active", progress: 72,
    milestones: [
      { id: "m1", title: "สอบกลางภาคผ่าน", completed: true, completedAt: new Date() },
      { id: "m2", title: "ส่งงานครบทุกชิ้น", completed: false },
      { id: "m3", title: "สอบปลายภาคผ่าน", completed: false },
    ],
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "g2", userId: "demo-student-1", title: "วิ่ง 5 กม. ได้ภายใน 30 นาที",
    category: "health", status: "active", progress: 40,
    milestones: [
      { id: "m1", title: "วิ่ง 3 กม. ต่อเนื่อง", completed: true },
      { id: "m2", title: "วิ่ง 5 กม. (ไม่จำกัดเวลา)", completed: false },
      { id: "m3", title: "วิ่ง 5 กม. ใน 30 นาที", completed: false },
    ],
    createdAt: new Date(), updatedAt: new Date(),
  },
];

// ── Wellbeing Logs ────────────────────────────────────────────
export const DEMO_WELLBEING_LOGS: WellbeingLog[] = [
  { id: "w1", userId: "demo-student-1", stressLevel: 5, motivationLevel: 7, sleepQuality: 7, socialConnection: 6, overallWellbeing: 7, burnoutRisk: "low", recordedAt: new Date(), createdAt: new Date() },
  { id: "w2", userId: "demo-student-1", stressLevel: 7, motivationLevel: 5, sleepQuality: 5, socialConnection: 5, overallWellbeing: 5, burnoutRisk: "moderate", recordedAt: new Date(Date.now() - 604800000), createdAt: new Date(Date.now() - 604800000) },
];

// ── Notifications ─────────────────────────────────────────────
export const DEMO_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "demo-student-1", type: "encouragement", title: "ทำได้ดีมาก! 🎉", body: "โฟกัสติดต่อกัน 7 วันแล้ว ยอดเยี่ยมมาก", isRead: false, createdAt: new Date(Date.now() - 3600000) },
  { id: "n2", userId: "demo-student-1", type: "reminder", title: "อย่าลืมสะท้อนคิดวันนี้นะ", body: "การสะท้อนคิดเพียง 5 นาทีจะช่วยให้วันของคุณดีขึ้นมาก", isRead: false, createdAt: new Date(Date.now() - 7200000) },
  { id: "n3", userId: "demo-student-1", type: "achievement", title: "ปลดล็อกสำเร็จ! ⭐", body: "ได้รับ streak badge: 7 วันต่อเนื่อง!", isRead: true, createdAt: new Date(Date.now() - 86400000) },
  { id: "n4", userId: "demo-student-1", type: "reminder", title: "งานใกล้ครบกำหนดแล้ว", body: "รายงาน Algorithm Analysis ครบกำหนดในอีก 1 วัน", isRead: true, createdAt: new Date(Date.now() - 172800000) },
];

// ── Engagement Metrics ────────────────────────────────────────
export const DEMO_ENGAGEMENT_METRICS: EngagementMetrics[] = [
  { userId: "s1", reflectionRate: 85, taskCompletionRate: 78, focusConsistency: 72, wellbeingTrend: "improving", lastActiveAt: new Date(), riskLevel: "low" },
  { userId: "s2", reflectionRate: 32, taskCompletionRate: 45, focusConsistency: 30, wellbeingTrend: "declining", lastActiveAt: new Date(Date.now() - 259200000), riskLevel: "elevated" },
  { userId: "s3", reflectionRate: 91, taskCompletionRate: 95, focusConsistency: 88, wellbeingTrend: "stable", lastActiveAt: new Date(), riskLevel: "low" },
  { userId: "s4", reflectionRate: 20, taskCompletionRate: 30, focusConsistency: 15, wellbeingTrend: "declining", lastActiveAt: new Date(Date.now() - 432000000), riskLevel: "high" },
  { userId: "s5", reflectionRate: 67, taskCompletionRate: 70, focusConsistency: 65, wellbeingTrend: "stable", lastActiveAt: new Date(Date.now() - 86400000), riskLevel: "moderate" },
];

// ── Students List ─────────────────────────────────────────────
export const DEMO_STUDENTS_LIST = [
  { id: "s1", name: "พิมพ์ใจ รักเรียน",      studentId: "6601234567", sectionId: "sec-001", engagement: 85, lastActive: "วันนี้",      reflections: 18, taskRate: 78, riskLevel: "low"      as const },
  { id: "s2", name: "ธนภัทร ใจดี",           studentId: "6601234568", sectionId: "sec-001", engagement: 32, lastActive: "3 วันที่แล้ว",  reflections: 4,  taskRate: 45, riskLevel: "elevated"  as const },
  { id: "s3", name: "ชนิกา สว่างใจ",         studentId: "6601234569", sectionId: "sec-002", engagement: 91, lastActive: "วันนี้",      reflections: 22, taskRate: 95, riskLevel: "low"      as const },
  { id: "s4", name: "กิตติภูมิ เพียรเรียน",  studentId: "6601234570", sectionId: "sec-002", engagement: 20, lastActive: "5 วันที่แล้ว",  reflections: 2,  taskRate: 30, riskLevel: "high"     as const },
  { id: "s5", name: "วรรณวิภา ตั้งใจ",       studentId: "6601234571", sectionId: "sec-001", engagement: 67, lastActive: "เมื่อวาน",     reflections: 14, taskRate: 70, riskLevel: "moderate" as const },
  { id: "s6", name: "ภูผา นำโชค",            studentId: "6601234572", sectionId: "sec-002", engagement: 55, lastActive: "เมื่อวาน",     reflections: 10, taskRate: 60, riskLevel: "moderate" as const },
  { id: "s7", name: "นภาพร เจริญสุข",        studentId: "6601234573", sectionId: "sec-003", engagement: 78, lastActive: "วันนี้",      reflections: 16, taskRate: 82, riskLevel: "low"      as const },
  { id: "s8", name: "ศักดิ์ชัย มุ่งมั่น",    studentId: "6601234574", sectionId: "sec-003", engagement: 44, lastActive: "2 วันที่แล้ว",  reflections: 8,  taskRate: 55, riskLevel: "moderate" as const },
];

// ── Sections ──────────────────────────────────────────────────
export const DEMO_SECTIONS: Section[] = [
  { id: "sec-001", courseId: "course-1", sectionNumber: "001", teacherId: "demo-teacher-1", enrolledStudents: ["s1","s2","s5"], maxCapacity: 40, schedule: "จ-พ 09:00-10:30", room: "SC201", createdAt: new Date() },
  { id: "sec-002", courseId: "course-1", sectionNumber: "002", teacherId: "demo-teacher-1", enrolledStudents: ["s3","s4","s6"], maxCapacity: 40, schedule: "อ-พฤ 13:00-14:30", room: "SC202", createdAt: new Date() },
  { id: "sec-003", courseId: "course-2", sectionNumber: "001", teacherId: "demo-teacher-2", enrolledStudents: ["s7","s8"],       maxCapacity: 35, schedule: "พ-ศ 10:30-12:00",  room: "EN101", createdAt: new Date() },
];

// ── Courses ───────────────────────────────────────────────────
export const DEMO_COURSES: Course[] = [
  {
    id: "course-1", code: "CS301", name: "อัลกอริทึมและโครงสร้างข้อมูล", nameEn: "Algorithms & Data Structures",
    teacherIds: ["demo-teacher-1"], departmentId: "dept-cs", facultyId: "fac-sci",
    semester: "1", year: 2567, credits: 3,
    sections: DEMO_SECTIONS.filter(s => s.courseId === "course-1"),
    enrolledStudents: ["s1","s2","s3","s4","s5","s6"],
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "course-2", code: "CS401", name: "วิศวกรรมซอฟต์แวร์", nameEn: "Software Engineering",
    teacherIds: ["demo-teacher-2"], departmentId: "dept-cs", facultyId: "fac-sci",
    semester: "1", year: 2567, credits: 3,
    sections: DEMO_SECTIONS.filter(s => s.courseId === "course-2"),
    enrolledStudents: ["s7","s8"],
    createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "course-3", code: "MATH201", name: "พีชคณิตเชิงเส้น", nameEn: "Linear Algebra",
    teacherIds: ["demo-teacher-3"], departmentId: "dept-math", facultyId: "fac-sci",
    semester: "1", year: 2567, credits: 3,
    sections: [],
    enrolledStudents: ["s1","s3","s5","s7"],
    createdAt: new Date(), updatedAt: new Date(),
  },
];

// ── Teachers List (for admin) ─────────────────────────────────
export const DEMO_TEACHERS_LIST = [
  { id: "demo-teacher-1", name: "ผศ.ดร. วรรณภา สอนดี",   email: "wannapa@kku.ac.th",  department: "วิทยาการคอมพิวเตอร์", faculty: "วิทยาศาสตร์ฯ", courses: 2, students: 80, isActive: true },
  { id: "demo-teacher-2", name: "อ.ดร. ประสิทธิ์ ดีเลิศ", email: "prasit@kku.ac.th",   department: "วิทยาการคอมพิวเตอร์", faculty: "วิทยาศาสตร์ฯ", courses: 1, students: 45, isActive: true },
  { id: "demo-teacher-3", name: "รศ.ดร. มาลี คณิตดี",    email: "malee@kku.ac.th",    department: "คณิตศาสตร์",          faculty: "วิทยาศาสตร์ฯ", courses: 3, students: 120, isActive: true },
  { id: "demo-teacher-4", name: "อ. ชัยวุฒิ บริหารดี",   email: "chaiwut@kku.ac.th",  department: "บริหารธุรกิจ",         faculty: "บริหารธุรกิจ",   courses: 2, students: 95, isActive: false },
];

// ── All Users (for admin user management) ────────────────────
export const DEMO_ALL_USERS = [
  { id: "demo-student-1", name: "พิมพ์ใจ รักเรียน",      email: "student@kku.ac.th",  role: "student"      as const, faculty: "วิทยาศาสตร์ฯ", department: "วิทยาการคอมพิวเตอร์", lastLogin: "วันนี้",       isActive: true  },
  { id: "demo-teacher-1", name: "ผศ.ดร. วรรณภา สอนดี",  email: "teacher@kku.ac.th",  role: "teacher"      as const, faculty: "วิทยาศาสตร์ฯ", department: "วิทยาการคอมพิวเตอร์", lastLogin: "วันนี้",       isActive: true  },
  { id: "demo-psych-1",   name: "ดร. สุขสันต์ ใจดี",    email: "psych@kku.ac.th",    role: "psychologist" as const, faculty: "-",              department: "งานแนะแนว",             lastLogin: "เมื่อวาน",    isActive: true  },
  { id: "demo-admin-1",   name: "ผู้ดูแลระบบหลัก",       email: "admin@kku.ac.th",    role: "super_admin"  as const, faculty: "-",              department: "IT",                    lastLogin: "วันนี้",       isActive: true  },
  { id: "s1",             name: "พิมพ์ใจ รักเรียน",      email: "s1@kku.ac.th",       role: "student"      as const, faculty: "วิทยาศาสตร์ฯ", department: "วิทยาการคอมพิวเตอร์", lastLogin: "วันนี้",       isActive: true  },
  { id: "s2",             name: "ธนภัทร ใจดี",           email: "s2@kku.ac.th",       role: "student"      as const, faculty: "วิทยาศาสตร์ฯ", department: "วิทยาการคอมพิวเตอร์", lastLogin: "3 วันที่แล้ว", isActive: true  },
  { id: "s3",             name: "ชนิกา สว่างใจ",         email: "s3@kku.ac.th",       role: "student"      as const, faculty: "วิทยาศาสตร์ฯ", department: "วิทยาการคอมพิวเตอร์", lastLogin: "วันนี้",       isActive: true  },
  { id: "s4",             name: "กิตติภูมิ เพียรเรียน",  email: "s4@kku.ac.th",       role: "student"      as const, faculty: "วิทยาศาสตร์ฯ", department: "วิทยาการคอมพิวเตอร์", lastLogin: "5 วันที่แล้ว", isActive: false },
];

// ── Faculty Data ──────────────────────────────────────────────
export const DEMO_FACULTY_DATA = [
  { id: "fac-sci",  name: "วิทยาศาสตร์และเทคโนโลยี", nameEn: "Science & Technology", students: 320, teachers: 28, courses: 45, engagement: 78, atRisk: 12 },
  { id: "fac-hum",  name: "มนุษยศาสตร์และสังคมศาสตร์", nameEn: "Humanities & Social Sciences", students: 280, teachers: 22, courses: 38, engagement: 72, atRisk: 18 },
  { id: "fac-bus",  name: "บริหารธุรกิจและการบัญชี", nameEn: "Business & Accounting", students: 410, teachers: 31, courses: 52, engagement: 81, atRisk: 8 },
  { id: "fac-eng",  name: "วิศวกรรมศาสตร์", nameEn: "Engineering", students: 195, teachers: 18, courses: 30, engagement: 68, atRisk: 22 },
  { id: "fac-med",  name: "แพทยศาสตร์", nameEn: "Medicine", students: 42, teachers: 35, courses: 28, engagement: 88, atRisk: 3 },
];

// ── Admin Dashboard Stats ────────────────────────────────────
export const DEMO_ADMIN_STATS: AdminDashboardStats = {
  totalUsers: 1247,
  activeStudents: 892,
  engagementRate: 73.4,
  reflectionCompletionRate: 68.2,
  averageFocusMinutes: 87,
  atRiskStudents: 43,
  aiInteractions: 15840,
  platformUptime: 99.7,
  totalCourses: 24,
  totalSections: 68,
  totalTeachers: 134,
  totalFaculties: 5,
};

// ── Chart Data ────────────────────────────────────────────────
export const DEMO_WEEKLY_FOCUS_DATA = [
  { day: "จ.", minutes: 85 },
  { day: "อ.", minutes: 120 },
  { day: "พ.", minutes: 70 },
  { day: "พฤ.", minutes: 95 },
  { day: "ศ.", minutes: 110 },
  { day: "ส.", minutes: 45 },
  { day: "อา.", minutes: 30 },
];

export const DEMO_MOOD_TREND = [
  { date: "6 วันที่แล้ว", mood: 3, energy: 4 },
  { date: "5 วันที่แล้ว", mood: 5, energy: 4 },
  { date: "4 วันที่แล้ว", mood: 4, energy: 3 },
  { date: "3 วันที่แล้ว", mood: 2, energy: 2 },
  { date: "2 วันที่แล้ว", mood: 4, energy: 5 },
  { date: "เมื่อวาน",     mood: 3, energy: 3 },
  { date: "วันนี้",       mood: 4, energy: 4 },
];

export const DEMO_ADMIN_USER_GROWTH = [
  { month: "ส.ค.", users: 850,  students: 710, teachers: 120, psychologists: 20 },
  { month: "ก.ย.", users: 920,  students: 770, teachers: 125, psychologists: 25 },
  { month: "ต.ค.", users: 985,  students: 820, teachers: 128, psychologists: 27 },
  { month: "พ.ย.", users: 1050, students: 875, teachers: 130, psychologists: 30 },
  { month: "ธ.ค.", users: 1120, students: 935, teachers: 132, psychologists: 33 },
  { month: "ม.ค.", users: 1200, students: 1000, teachers: 133, psychologists: 34 },
  { month: "ก.พ.", users: 1247, students: 1040, teachers: 134, psychologists: 35 },
];

export const DEMO_FEATURE_USAGE = [
  { feature: "ติดตามงาน",   usage: 85 },
  { feature: "โฟกัสโหมด",   usage: 78 },
  { feature: "สะท้อนคิด",   usage: 68 },
  { feature: "เช็คอินอารมณ์", usage: 62 },
  { feature: "โค้ช AI",     usage: 55 },
  { feature: "เป้าหมาย",    usage: 45 },
];

export const DEMO_WELLBEING_TREND_ADMIN = [
  { month: "ก.ย.", low: 62, moderate: 22, elevated: 12, high: 4 },
  { month: "ต.ค.", low: 58, moderate: 25, elevated: 13, high: 4 },
  { month: "พ.ย.", low: 60, moderate: 23, elevated: 12, high: 5 },
  { month: "ธ.ค.", low: 55, moderate: 26, elevated: 14, high: 5 },
  { month: "ม.ค.", low: 63, moderate: 22, elevated: 11, high: 4 },
  { month: "ก.พ.", low: 65, moderate: 21, elevated: 10, high: 4 },
];
