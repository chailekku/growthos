// ============================================================
// Core Domain Types for Gekku GrowthOS
// ============================================================

export type UserRole = "student" | "teacher" | "psychologist" | "super_admin" | "system_admin";

export type Language = "th" | "en";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  department?: string;
  faculty?: string;
  studentId?: string;
  teacherId?: string;
  createdAt: Date;
  updatedAt: Date;
  privacySettings: PrivacySettings;
  language: Language;
  isActive: boolean;
}

export interface PrivacySettings {
  reflectionsVisible: boolean;
  analyticsShared: boolean;
  wellbeingShared: boolean;
  focusDataShared: boolean;
}

// ============================================================
// Task & Planner
// ============================================================

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";
export type TaskCategory = "academic" | "personal" | "health" | "social" | "career" | "other";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate?: Date;
  completedAt?: Date;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Focus Sessions
// ============================================================

export type FocusSessionType = "pomodoro" | "deep_work" | "short_focus" | "study";
export type FocusSessionStatus = "active" | "break" | "completed" | "cancelled";

export interface FocusSession {
  id: string;
  userId: string;
  type: FocusSessionType;
  status: FocusSessionStatus;
  plannedMinutes: number;
  actualMinutes: number;
  breakMinutes: number;
  distractionCount: number;
  flowScore: number; // 0-100
  qualityScore: number; // 0-100
  notes?: string;
  taskId?: string;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
}

// ============================================================
// Reflection & Mood
// ============================================================

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type ReflectionType = "daily" | "weekly" | "monthly" | "goal";

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodLevel;
  energy: EnergyLevel;
  emotions: string[];
  notes?: string;
  recordedAt: Date;
  createdAt: Date;
}

export interface ReflectionEntry {
  id: string;
  userId: string;
  type: ReflectionType;
  prompt?: string;
  content: string;
  gratitude?: string[];
  challenges?: string;
  goals?: string;
  aiInsight?: string;
  isPrivate: boolean;
  mood?: MoodLevel;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// Habits & Goals
// ============================================================

export type HabitFrequency = "daily" | "weekly" | "monthly";
export type GoalCategory = "academic" | "health" | "personal" | "career" | "social";
export type GoalStatus = "active" | "completed" | "paused" | "cancelled";

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  completionDates: Date[];
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  status: GoalStatus;
  targetDate?: Date;
  progress: number; // 0-100
  milestones: GoalMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

// ============================================================
// Wellbeing & Burnout
// ============================================================

export type WellbeingRisk = "low" | "moderate" | "elevated" | "high";

export interface WellbeingLog {
  id: string;
  userId: string;
  stressLevel: number; // 1-10
  motivationLevel: number; // 1-10
  sleepQuality: number; // 1-10
  socialConnection: number; // 1-10
  overallWellbeing: number; // 1-10
  burnoutRisk: WellbeingRisk;
  notes?: string;
  recordedAt: Date;
  createdAt: Date;
}

// ============================================================
// AI Feedback & Coaching
// ============================================================

export type AICoachType = "productivity" | "reflection" | "focus" | "self_leadership" | "wellbeing";

export interface AIFeedback {
  id: string;
  userId: string;
  coachType: AICoachType;
  prompt: string;
  response: string;
  context?: Record<string, unknown>;
  rating?: number; // 1-5
  createdAt: Date;
}

// ============================================================
// Analytics & Productivity
// ============================================================

export interface ProductivityLog {
  id: string;
  userId: string;
  date: Date;
  tasksCompleted: number;
  tasksCreated: number;
  focusMinutes: number;
  productivityScore: number; // 0-100
  createdAt: Date;
}

export interface EngagementMetrics {
  userId: string;
  reflectionRate: number; // 0-100 percentage of days with reflections
  taskCompletionRate: number; // 0-100
  focusConsistency: number; // 0-100
  wellbeingTrend: "improving" | "stable" | "declining";
  lastActiveAt: Date;
  riskLevel: WellbeingRisk;
}

// ============================================================
// Notifications
// ============================================================

export type NotificationType = "reminder" | "encouragement" | "achievement" | "alert" | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// ============================================================
// University Structure
// ============================================================

export interface Department {
  id: string;
  name: string;
  nameEn: string;
  facultyId: string;
  headId?: string;
  createdAt: Date;
}

export interface Faculty {
  id: string;
  name: string;
  nameEn: string;
  deanId?: string;
  departments: string[];
  createdAt: Date;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  teacherId: string;
  departmentId: string;
  semester: string;
  year: number;
  enrolledStudents: string[];
  createdAt: Date;
}

// ============================================================
// Audit & Permissions
// ============================================================

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

// ============================================================
// Dashboard Stats
// ============================================================

export interface StudentDashboardStats {
  todayFocusMinutes: number;
  weeklyFocusMinutes: number;
  tasksCompletedToday: number;
  tasksTotal: number;
  currentStreak: number;
  reflectionCompletedToday: boolean;
  currentMood?: MoodLevel;
  wellbeingScore: number;
  productivityScore: number;
  weeklyGoalProgress: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeStudents: number;
  engagementRate: number;
  reflectionCompletionRate: number;
  averageFocusMinutes: number;
  atRiskStudents: number;
  aiInteractions: number;
  platformUptime: number;
}
