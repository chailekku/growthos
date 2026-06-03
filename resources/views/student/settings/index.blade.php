<x-app-layout>
<x-slot:title>Settings</x-slot:title>

<div x-data="settings()" class="max-w-2xl mx-auto space-y-6">

    {{-- ── Header ──────────────────────────────────────────────── --}}
    <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-sm text-gray-400 mt-0.5">Manage your profile, preferences and privacy</p>
    </div>

    <form method="POST" action="{{ route('student.settings.update') }}" class="space-y-6">
        @csrf

        {{-- ── Profile Section ─────────────────────────────────── --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <h2 class="text-sm font-bold text-gray-900 mb-5 uppercase tracking-wide" style="color:#2D9375;">Profile</h2>

            {{-- Avatar + name + role --}}
            <div class="flex items-center gap-4 mb-6">
                <div class="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                     style="background-color:#2D9375;">
                    {{ strtoupper(substr(auth()->user()->name, 0, 2)) }}
                </div>
                <div>
                    <p class="text-base font-bold text-gray-900">{{ auth()->user()->name }}</p>
                    <p class="text-sm text-gray-400">{{ auth()->user()->email }}</p>
                    <span class="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-semibold"
                          style="background-color:#d1fae5; color:#065f46;">Student</span>
                </div>
            </div>

            <div class="space-y-4">
                {{-- Name — READ ONLY --}}
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
                    <input type="text" value="{{ auth()->user()->name }}" disabled
                           class="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                    <p class="text-xs text-gray-400 mt-1">Name cannot be changed — managed by KKU SSO</p>
                </div>
                {{-- Email — READ ONLY --}}
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">Email Address</label>
                    <input type="email" value="{{ auth()->user()->email }}" disabled
                           class="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                    <p class="text-xs text-gray-400 mt-1">Email cannot be changed — managed by KKU SSO</p>
                </div>
            </div>
        </div>

        {{-- ── Language & Theme ─────────────────────────────────── --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <h2 class="text-sm font-bold mb-5 uppercase tracking-wide" style="color:#2D9375;">Language &amp; Theme</h2>

            <div class="grid grid-cols-2 gap-6">
                {{-- Language --}}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <div class="flex gap-1 bg-gray-50 rounded-xl p-1">
                        <button type="button" @click="lang = 'en'"
                                :class="lang === 'en' ? 'bg-white shadow-sm font-semibold text-gray-900' : 'text-gray-500'"
                                class="flex-1 py-2 px-4 rounded-lg text-sm transition-all">
                            EN
                        </button>
                        <button type="button" @click="lang = 'th'"
                                :class="lang === 'th' ? 'bg-white shadow-sm font-semibold text-gray-900' : 'text-gray-500'"
                                class="flex-1 py-2 px-4 rounded-lg text-sm transition-all">
                            TH
                        </button>
                    </div>
                    <input type="hidden" name="language" :value="lang">
                </div>

                {{-- Theme --}}
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <div class="flex gap-1 bg-gray-50 rounded-xl p-1">
                        <button type="button" @click="theme = 'light'"
                                :class="theme === 'light' ? 'bg-white shadow-sm font-semibold text-gray-900' : 'text-gray-500'"
                                class="flex-1 py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                            Light
                        </button>
                        <button type="button" @click="theme = 'dark'"
                                :class="theme === 'dark' ? 'bg-white shadow-sm font-semibold text-gray-900' : 'text-gray-500'"
                                class="flex-1 py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5">
                            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                            Dark
                        </button>
                    </div>
                    <input type="hidden" name="theme" :value="theme">
                </div>
            </div>
        </div>

        {{-- ── Privacy Section ──────────────────────────────────── --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <h2 class="text-sm font-bold mb-1 uppercase tracking-wide" style="color:#2D9375;">Privacy</h2>
            <p class="text-xs text-gray-400 mb-5">Control who can see your data</p>

            <div class="space-y-4">
                @foreach([
                    ['reflection_journal',  'Reflection Journal',       'Share your journal entries with advisors'],
                    ['productivity_trends', 'Productivity Trends',      'Share focus and task data with teachers'],
                    ['mood_tracker',        'Mood Tracker',             'Share mood data with psychologist'],
                    ['focus_analytics',     'Focus Analytics',          'Share detailed focus metrics'],
                    ['teacher_advisor',     'Teacher / Advisor',        'Allow teachers to view your progress'],
                    ['psychologist',        'Psychologist',             'Allow psychologist to view wellbeing data'],
                    ['anonymous_mode',      'Anonymous Mode',           'Anonymize your data in reports and comparisons'],
                ] as [$key, $label, $desc])
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-800">{{ $label }}</p>
                            <p class="text-xs text-gray-400">{{ $desc }}</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="hidden" name="privacy[{{ $key }}]" value="0">
                            <input type="checkbox" name="privacy[{{ $key }}]" value="1" class="sr-only peer">
                            <div class="w-10 h-5.5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-teal-500 border border-gray-200 peer-checked:border-teal-500"
                                 style="height:22px; width:40px;">
                                <div class="absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-[18px]"></div>
                            </div>
                        </label>
                    </div>
                @endforeach
            </div>
        </div>

        {{-- ── Notifications Section ────────────────────────────── --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-6" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <h2 class="text-sm font-bold mb-1 uppercase tracking-wide" style="color:#2D9375;">Notifications</h2>
            <p class="text-xs text-gray-400 mb-5">Choose what you get notified about</p>

            <div class="space-y-4">
                @foreach([
                    ['notif_reflection', 'Daily Reflection Reminders', 'Remind me to write a reflection each day', true],
                    ['notif_focus',      'Focus Mode Reminders',       'Remind me to start focus sessions', true],
                    ['notif_ai',         'AI Insights',                'Receive personalized AI insights', true],
                    ['notif_trends',     'Productivity Trends Report', 'Weekly summary of your productivity', true],
                    ['notif_email',      'Email Notifications',        'Receive notifications via email', true],
                    ['notif_push',       'Push Notifications',         'Receive push notifications in browser', true],
                ] as [$key, $label, $desc, $default])
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-800">{{ $label }}</p>
                            <p class="text-xs text-gray-400">{{ $desc }}</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer shrink-0">
                            <input type="checkbox" name="notifications[{{ $key }}]" value="1"
                                   class="sr-only"
                                   x-data
                                   :checked="$data['notif_{{ $key }}'] ?? {{ $default ? 'true' : 'false' }}"
                                   {{ $default ? 'checked' : '' }}>
                            <div class="relative" style="width:40px; height:22px;">
                                <div class="absolute inset-0 rounded-full transition-colors"
                                     :style="$el.previousElementSibling.checked ? 'background-color:#2D9375;' : 'background-color:#e5e7eb;'"
                                     style="background-color:#2D9375;"></div>
                                <div class="absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform"
                                     :style="$el.previousElementSibling.checked ? 'transform:translateX(18px)' : ''"
                                     style="transform:translateX(18px)"></div>
                            </div>
                        </label>
                    </div>
                @endforeach
            </div>
        </div>

        {{-- ── Version Footer ───────────────────────────────────── --}}
        <div class="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl flex items-center justify-center text-white" style="background-color:#2D9375;">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div>
                    <p class="text-sm font-bold text-gray-900">GrowthOS</p>
                    <p class="text-xs text-gray-400">Version 1.0.0 · KKU Growth Platform</p>
                </div>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full font-medium" style="background:#d1fae5; color:#065f46;">Stable</span>
        </div>

        {{-- ── Save Button ──────────────────────────────────────── --}}
        <div class="flex justify-end">
            <button type="submit"
                    class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    style="background-color:#2D9375;">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Save Settings
            </button>
        </div>
    </form>
</div>

<script>
function settings() {
    return {
        lang: localStorage.getItem('lang') || 'en',
        theme: localStorage.getItem('theme') || 'light',
    }
}
</script>
</x-app-layout>
