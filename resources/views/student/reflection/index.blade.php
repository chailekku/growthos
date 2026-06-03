<x-app-layout>
<x-slot:title>Reflection Journal</x-slot:title>

<div x-data="reflection()" class="max-w-4xl mx-auto space-y-6">

    {{-- ── Header ──────────────────────────────────────────────── --}}
    <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
            <div class="h-11 w-11 rounded-xl flex items-center justify-center text-white" style="background-color:#2D9375;">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Reflection Journal</h1>
                <p class="text-sm text-gray-400 mt-0.5">How are you feeling?</p>
            </div>
        </div>
    </div>

    {{-- ── Activity Heatmap ─────────────────────────────────────── --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <p class="text-sm font-semibold text-gray-900 mb-3">Activity — Last 30 Days</p>
        <div class="flex flex-wrap gap-1.5">
            @for($i = 29; $i >= 0; $i--)
                @php $hasEntry = rand(0,1); $intensity = $hasEntry ? rand(1,3) : 0; @endphp
                <div class="h-5 w-5 rounded-sm tooltip-trigger"
                     style="background-color: {{ ['#e5e7eb','#bbf7d0','#6ee7b7','#059669'][$intensity] }};"
                     title="{{ now()->subDays($i)->format('M j') }}"></div>
            @endfor
        </div>
        <div class="flex items-center gap-2 mt-2">
            <span class="text-xs text-gray-400">Less</span>
            <div class="h-3.5 w-3.5 rounded-sm" style="background-color:#e5e7eb;"></div>
            <div class="h-3.5 w-3.5 rounded-sm" style="background-color:#bbf7d0;"></div>
            <div class="h-3.5 w-3.5 rounded-sm" style="background-color:#6ee7b7;"></div>
            <div class="h-3.5 w-3.5 rounded-sm" style="background-color:#059669;"></div>
            <span class="text-xs text-gray-400">More</span>
        </div>
    </div>

    {{-- ── New Entry Form ────────────────────────────────────────── --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">

        {{-- Tabs --}}
        <div class="flex gap-1 bg-gray-50 rounded-xl p-1 mb-5">
            <button @click="activeTab = 'daily'"
                    :class="activeTab === 'daily' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'"
                    class="flex-1 py-2 px-3 rounded-lg text-sm transition-all">Daily Reflection</button>
            <button @click="activeTab = 'weekly'"
                    :class="activeTab === 'weekly' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'"
                    class="flex-1 py-2 px-3 rounded-lg text-sm transition-all">Weekly Reflection</button>
            <button @click="activeTab = 'mood'"
                    :class="activeTab === 'mood' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'"
                    class="flex-1 py-2 px-3 rounded-lg text-sm transition-all">Mood Check-in</button>
        </div>

        <form method="POST" action="{{ route('student.reflection.store') }}" class="space-y-5">
            @csrf
            <input type="hidden" name="type" :value="activeTab">

            {{-- Mood Selector --}}
            <div>
                <p class="text-sm font-semibold text-gray-700 mb-3">How are you feeling today?</p>
                <div class="flex gap-3">
                    @foreach([['😔','1','Struggling','bg-red-50 border-red-200'],['😕','2','Low','bg-orange-50 border-orange-200'],['😐','3','Okay','bg-yellow-50 border-yellow-200'],['🙂','4','Good','bg-teal-50 border-teal-200'],['😄','5','Great','bg-green-50 border-green-200']] as [$emoji, $val, $label, $cls])
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="mood" value="{{ $val }}" class="sr-only peer" x-model="selectedMood">
                            <div class="flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all peer-checked:ring-2 {{ $cls }}"
                                 style="--tw-ring-color:#2D9375;"
                                 :class="selectedMood === '{{ $val }}' ? 'border-teal-400 ring-2 ring-teal-300' : ''">
                                <span class="text-2xl">{{ $emoji }}</span>
                                <span class="text-xs font-medium text-gray-600">{{ $label }}</span>
                            </div>
                        </label>
                    @endforeach
                </div>
            </div>

            {{-- Energy Level --}}
            <div>
                <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-semibold text-gray-700">Energy Level</p>
                    <span class="text-sm font-bold" style="color:#2D9375;" x-text="energyLevel + '/5'"></span>
                </div>
                <input type="range" name="energy" min="1" max="5" step="1" x-model="energyLevel"
                       class="w-full" style="accent-color:#2D9375;">
                <div class="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Exhausted</span><span>Moderate</span><span>Energized</span>
                </div>
            </div>

            {{-- AI Reflection Prompt --}}
            <div class="rounded-xl p-4 border" style="background:#f0faf5; border-color:#c3e6cb;">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <svg class="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        <span class="text-xs font-semibold text-teal-700">AI Reflection Prompt</span>
                    </div>
                    <button type="button" @click="nextPrompt()" class="text-xs text-teal-600 font-medium hover:underline">New prompt</button>
                </div>
                <p class="text-sm text-gray-600 italic" x-text="prompts[promptIndex]"></p>
            </div>

            {{-- Text Areas --}}
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">What are you grateful for?</label>
                    <textarea name="gratitude_text" rows="2"
                              placeholder="List 1–3 things you feel grateful for today..."
                              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none resize-none"
                              style="focus-ring-color:#2D9375;"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">What challenged you today?</label>
                    <textarea name="content" rows="3"
                              placeholder="Describe a challenge you faced and what you learned from it..."
                              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none resize-none"
                              style="focus-ring-color:#2D9375;" required></textarea>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">What did you achieve today?</label>
                    <textarea name="achievements" rows="2"
                              placeholder="Celebrate your wins, big or small..."
                              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none resize-none"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">What is your intention for tomorrow?</label>
                    <textarea name="intention" rows="2"
                              placeholder="Set a clear intention or focus for tomorrow..."
                              class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none resize-none"></textarea>
                </div>
            </div>

            {{-- Submit --}}
            <div>
                <button type="submit"
                        :disabled="!selectedMood"
                        class="w-full py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                        style="background-color:#2D9375;">
                    Save Reflection
                </button>
                <p x-show="!selectedMood" class="text-xs text-center text-amber-500 mt-2">Please select your mood to save</p>
            </div>
        </form>
    </div>

    {{-- ── Previous Reflections ─────────────────────────────────── --}}
    <div class="space-y-4">
        <h2 class="text-base font-semibold text-gray-900">Previous Reflections</h2>
        @forelse($entries as $entry)
            <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">{{ ['😔','😕','😐','🙂','😄'][($entry->mood ?? 3) - 1] ?? '😐' }}</span>
                        <div>
                            <p class="text-sm font-semibold text-gray-800">{{ $entry->created_at->format('D, M j, Y') }}</p>
                            <span class="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium">{{ ucfirst($entry->type) }}</span>
                        </div>
                    </div>
                </div>
                <p class="text-sm text-gray-600 leading-relaxed">{{ Str::limit($entry->content, 240) }}</p>
                @if($entry->ai_insight)
                    <div class="mt-3 rounded-xl p-3 border" style="background:#f0faf5; border-color:#c3e6cb;">
                        <p class="text-xs font-semibold text-teal-700 mb-1">AI Insight</p>
                        <p class="text-xs text-gray-600">{{ $entry->ai_insight }}</p>
                    </div>
                @endif
            </div>
        @empty
            <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
                <div class="text-5xl mb-4">📓</div>
                <p class="text-gray-500 font-medium">No reflections yet</p>
                <p class="text-sm text-gray-400 mt-1">Write your first reflection above to get started</p>
            </div>
        @endforelse
    </div>
</div>

<script>
function reflection() {
    return {
        activeTab: 'daily',
        selectedMood: '',
        energyLevel: 3,
        promptIndex: 0,
        prompts: [
            'What is one thing you did today that you are proud of, however small?',
            'What would you tell your past self at the start of today?',
            'Where did you notice yourself growing, even slightly, today?',
            'What did today teach you about how you handle challenges?',
            'What is one habit or mindset you want to bring into tomorrow?',
        ],
        nextPrompt() {
            this.promptIndex = (this.promptIndex + 1) % this.prompts.length;
        }
    }
}
</script>
</x-app-layout>
