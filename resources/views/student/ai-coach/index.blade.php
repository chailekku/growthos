<x-app-layout>
<x-slot:title>AI Coach</x-slot:title>

<div x-data="aiCoach()" class="max-w-4xl mx-auto space-y-4">

    {{-- ── Header ──────────────────────────────────────────────── --}}
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0" style="background-color:#2D9375;">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <div>
                <h1 class="text-xl font-bold text-gray-900">AI Growth Coach</h1>
                <p class="text-xs text-gray-400 mt-0.5">A supportive companion for your growth journey</p>
            </div>
        </div>
        <button @click="newSession()"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style="background-color:#2D9375;">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            New Session
        </button>
    </div>

    {{-- ── Coach Type Tabs ──────────────────────────────────────── --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-1.5 flex flex-wrap gap-1" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        @foreach([
            ['productivity', '⚡', 'Productivity Coach'],
            ['reflection',   '📖', 'Reflection Coach'],
            ['focus',        '🎯', 'Focus Coach'],
            ['leadership',   '🌟', 'Self-Leadership Coach'],
            ['growth',       '🌱', 'Growth Mindset Coach'],
        ] as [$type, $icon, $label])
        <button @click="setCoachType('{{ $type }}')"
                :class="coachType === '{{ $type }}'
                    ? 'text-white rounded-xl px-3 py-2 text-sm font-semibold flex-shrink-0'
                    : 'text-gray-600 rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-50 flex-shrink-0'"
                :style="coachType === '{{ $type }}' ? 'background-color:#2D9375;' : ''">
            {{ $icon }} {{ $label }}
        </button>
        @endforeach
    </div>

    {{-- ── Chat Area ────────────────────────────────────────────── --}}
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">

        {{-- Messages --}}
        <div class="p-5 space-y-4 min-h-96 max-h-[480px] overflow-y-auto" id="chatBox">
            {{-- Welcome message --}}
            <div class="flex items-start gap-3">
                <div class="h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 text-sm" style="background-color:#2D9375;">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div class="max-w-lg rounded-2xl rounded-tl-none px-4 py-3" style="background-color:#f0faf5; border: 1px solid #c3e6cb;">
                    <p class="text-sm text-gray-800 leading-relaxed" x-text="welcomeMessages[coachType]"></p>
                </div>
            </div>

            {{-- Dynamic messages --}}
            <template x-for="msg in messages" :key="msg.id">
                <div :class="msg.role === 'user' ? 'flex-row-reverse' : ''" class="flex items-end gap-3">
                    <template x-if="msg.role !== 'user'">
                        <div class="h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0" style="background-color:#2D9375;">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        </div>
                    </template>
                    <div :class="msg.role === 'user'
                            ? 'text-white rounded-2xl rounded-br-none px-4 py-3 max-w-sm ml-auto'
                            : 'text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-lg'"
                         :style="msg.role === 'user'
                            ? 'background-color:#2D9375;'
                            : 'background-color:#f0faf5; border:1px solid #c3e6cb;'">
                        <p class="text-sm leading-relaxed" x-text="msg.content"></p>
                    </div>
                </div>
            </template>

            {{-- Loading indicator --}}
            <div x-show="loading" class="flex items-end gap-3">
                <div class="h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0" style="background-color:#2D9375;">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <div class="rounded-2xl rounded-tl-none px-4 py-3" style="background-color:#f0faf5; border:1px solid #c3e6cb;">
                    <div class="flex gap-1.5 items-center h-5">
                        <div class="w-2 h-2 rounded-full animate-bounce" style="background-color:#2D9375; animation-delay:0ms"></div>
                        <div class="w-2 h-2 rounded-full animate-bounce" style="background-color:#2D9375; animation-delay:150ms"></div>
                        <div class="w-2 h-2 rounded-full animate-bounce" style="background-color:#2D9375; animation-delay:300ms"></div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Quick Prompts --}}
        <div class="px-5 pb-3">
            <div class="flex flex-wrap gap-2">
                @foreach([
                    'Help me reflect on my day',
                    "I'm feeling overwhelmed",
                    'How can I find my focus?',
                    'I want to build better habits',
                    'Help me see a challenge differently',
                ] as $prompt)
                    <button @click="input = '{{ $prompt }}'; sendMessage()"
                            class="text-xs px-3 py-1.5 rounded-full border font-medium hover:bg-teal-50 transition-colors"
                            style="border-color:#c3e6cb; color:#2D9375;">
                        {{ $prompt }}
                    </button>
                @endforeach
            </div>
        </div>

        {{-- Input Bar --}}
        <div class="p-4 border-t border-gray-100">
            <div class="flex gap-3">
                <input type="text" x-model="input"
                       @keyup.enter="sendMessage()"
                       placeholder="Type your message..."
                       class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none"
                       style="focus-ring-color:#2D9375;">
                <button @click="sendMessage()"
                        :disabled="loading || !input.trim()"
                        class="h-10 w-10 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        style="background-color:#2D9375;">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>
        </div>
    </div>

    {{-- ── Footer disclaimer ────────────────────────────────────── --}}
    <p class="text-xs text-gray-400 text-center leading-relaxed">
        This AI coach is a supportive companion, not a replacement for professional help. Trust by default, reflection by design.
    </p>
</div>

<script>
function aiCoach() {
    return {
        coachType: 'productivity',
        messages: [],
        input: '',
        loading: false,
        msgId: 0,
        welcomeMessages: {
            productivity: "Welcome. I'm here to explore productivity with you — not to push harder, but to help you work in ways that feel aligned and sustainable. What's on your mind today?",
            reflection:   "Welcome to this reflective space. There's no judgment here — only curiosity. What experience or feeling from today would you like to sit with and explore?",
            focus:        "Let's look at focus together. Sometimes what we call 'distraction' is actually telling us something important. What's been pulling your attention away recently?",
            leadership:   "Self-leadership starts with self-understanding. Every step inward is a step toward becoming the person you want to be. What would you like to explore about yourself today?",
            growth:       "Challenges are where growth hides. I'm here to help you find the learning in whatever you're going through. What has been stretching you lately?",
        },
        setCoachType(type) {
            this.coachType = type;
            this.messages = [];
        },
        newSession() {
            this.messages = [];
            this.input = '';
        },
        async sendMessage() {
            if (!this.input.trim() || this.loading) return;
            const userMsg = this.input.trim();
            this.input = '';
            this.messages.push({ id: ++this.msgId, role: 'user', content: userMsg });
            this.loading = true;
            this.$nextTick(() => {
                const box = document.getElementById('chatBox');
                if (box) box.scrollTop = box.scrollHeight;
            });
            try {
                const res = await fetch('{{ route('student.ai-coach.chat') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content
                    },
                    body: JSON.stringify({ message: userMsg, coach_type: this.coachType })
                });
                const data = await res.json();
                this.messages.push({ id: ++this.msgId, role: 'assistant', content: data.response });
            } catch(e) {
                this.messages.push({ id: ++this.msgId, role: 'assistant', content: 'Something went wrong. Please try again.' });
            }
            this.loading = false;
            this.$nextTick(() => {
                const box = document.getElementById('chatBox');
                if (box) box.scrollTop = box.scrollHeight;
            });
        }
    }
}
</script>
</x-app-layout>
