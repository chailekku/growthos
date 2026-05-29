"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Circle, Clock, Tag, Filter, Search, Calendar } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18nStore } from "@/store/i18n-store";
import { translations } from "@/i18n";
import { DEMO_TASKS } from "@/lib/mock-data";
import type { Task, TaskStatus, TaskCategory } from "@/types";

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const CATEGORY_ICONS: Record<TaskCategory, string> = {
  academic: "📚", personal: "👤", health: "💪", social: "👥", career: "💼", other: "📌",
};

function TaskItem({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  const { language } = useI18nStore();
  const t = translations[language];
  const isCompleted = task.status === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group ${isCompleted ? "opacity-60" : ""}`}
    >
      <button onClick={() => onToggle(task.id)} className="mt-0.5 shrink-0">
        {isCompleted
          ? <CheckCircle2 className="h-5 w-5 text-green-500" />
          : <Circle className="h-5 w-5 text-gray-300 group-hover:text-brand-400" />
        }
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
            {t.student.tasks.priority[task.priority]}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            {CATEGORY_ICONS[task.category]} {t.student.tasks.category[task.category]}
          </span>
          {task.dueDate && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.dueDate.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
            </span>
          )}
          {task.estimatedMinutes && (
            <span className="text-xs text-gray-400">~{task.estimatedMinutes}m</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TasksPage() {
  const { language } = useI18nStore();
  const t = translations[language];
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (filter !== "all" && task.status !== filter) return false;
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const completionRate = Math.round((completedCount / tasks.length) * 100);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => {
      if (task.id !== id) return task;
      const newStatus: TaskStatus = task.status === "completed" ? "todo" : "completed";
      return { ...task, status: newStatus, completedAt: newStatus === "completed" ? new Date() : undefined };
    }));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `t${Date.now()}`, userId: "demo-student-1",
      title: newTaskTitle, priority: "medium", status: "todo",
      category: "academic", tags: [], createdAt: new Date(), updatedAt: new Date(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    setShowAddModal(false);
  };

  const FILTERS: { key: TaskStatus | "all"; label: string }[] = [
    { key: "all", label: language === "th" ? "ทั้งหมด" : "All" },
    { key: "todo", label: t.student.tasks.status.todo },
    { key: "in_progress", label: t.student.tasks.status.in_progress },
    { key: "completed", label: t.student.tasks.status.completed },
  ];

  return (
    <AppLayout title={t.student.tasks.title}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-brand-50 to-purple-50 border-brand-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">
                  {language === "th" ? "ความคืบหน้าวันนี้" : "Today's Progress"}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                  {completedCount} / {tasks.length} {language === "th" ? "งาน" : "tasks"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-brand-600">{completionRate}%</p>
              </div>
            </div>
            <Progress value={completedCount} max={tasks.length} className="h-3" indicatorClassName="bg-gradient-to-r from-brand-500 to-purple-500" />
          </CardContent>
        </Card>

        {/* Search & Add */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={language === "th" ? "ค้นหางาน..." : "Search tasks..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            {t.student.tasks.addTask}
          </Button>
        </div>

        {/* Add Task Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-brand-200 bg-brand-50/50">
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder={t.student.tasks.taskTitle}
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                    autoFocus
                    className="bg-white"
                  />
                  <div className="flex gap-2">
                    <Button onClick={addTask} size="sm" className="gap-1">
                      <Plus className="h-3.5 w-3.5" /> {t.common.add}
                    </Button>
                    <Button onClick={() => setShowAddModal(false)} variant="ghost" size="sm">
                      {t.common.cancel}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === key
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-card"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <Card>
          <CardContent className="p-2">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>{t.student.tasks.noTasks}</p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} />
                ))}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
