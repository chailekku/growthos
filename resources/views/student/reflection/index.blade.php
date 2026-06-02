<x-app-layout>
    <x-slot:title>บันทึกสะท้อนคิด</x-slot:title>

    <div x-data="{ lang: localStorage.getItem('lang') || 'th', showForm: false }" class="max-w-3xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900" x-text="lang === 'th' ? '📓 บันทึกสะท้อนคิด' : '📓 Reflection Journal'"></h1>
            <button @click="showForm = !showForm" class="btn-primary">
                <span x-text="lang === 'th' ? '+ เขียนบันทึก' : '+ Write Entry'"></span>
            </button>
        </div>

        {{-- New Entry Form --}}
        <div x-show="showForm" x-transition class="card">
            <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? 'บันทึกสะท้อนคิดใหม่' : 'New Reflection Entry'"></h3>
            <form method="POST" action="{{ route('student.reflection.store') }}" class="space-y-4">
                @csrf
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" x-text="lang === 'th' ? 'วันนี้เป็นอย่างไรบ้าง?' : 'How was your day?'"></label>
                    <textarea name="content" rows="4"
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                              :placeholder="lang === 'th' ? 'เขียนเล่าสิ่งที่เกิดขึ้น ความรู้สึก หรือสิ่งที่เรียนรู้วันนี้...' : 'Write about what happened, how you felt, or what you learned...'"
                              required></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" x-text="lang === 'th' ? 'อารมณ์ (1-5)' : 'Mood (1-5)'"></label>
                        <input type="range" name="mood" min="1" max="5" value="3"
                               class="w-full accent-indigo-600">
                        <div class="flex justify-between text-xs text-gray-400 mt-1">
                            <span>😞</span><span>😐</span><span>😄</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1" x-text="lang === 'th' ? 'ประเภท' : 'Type'"></label>
                        <select name="type" class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                            <option value="daily" x-text="lang === 'th' ? 'บันทึกประจำวัน' : 'Daily'">Daily</option>
                            <option value="weekly" x-text="lang === 'th' ? 'สรุปสัปดาห์' : 'Weekly'">Weekly</option>
                            <option value="goal" x-text="lang === 'th' ? 'เป้าหมาย' : 'Goal'">Goal</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" x-text="lang === 'th' ? '3 สิ่งที่ขอบคุณ' : '3 Things Grateful For'"></label>
                    <input type="text" name="gratitude[]" placeholder="สิ่งแรก / First thing"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-indigo-500">
                    <input type="text" name="gratitude[]" placeholder="สิ่งที่สอง / Second thing"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-indigo-500">
                    <input type="text" name="gratitude[]" placeholder="สิ่งที่สาม / Third thing"
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" @click="showForm = false" class="btn-secondary" x-text="lang === 'th' ? 'ยกเลิก' : 'Cancel'"></button>
                    <button type="submit" class="btn-primary" x-text="lang === 'th' ? 'บันทึก + ขอ AI Insight' : 'Save + Get AI Insight'"></button>
                </div>
            </form>
        </div>

        {{-- Entries List --}}
        <div class="space-y-4">
            @forelse($entries as $entry)
                <div class="card">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="text-lg">{{ ['😞','😕','😐','🙂','😄'][$entry->mood - 1] ?? '😐' }}</span>
                                <span class="text-sm font-semibold text-gray-800">{{ $entry->created_at->locale('th')->isoFormat('D MMMM YYYY') }}</span>
                                <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">{{ $entry->type }}</span>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-700 text-sm leading-relaxed mb-3">{{ Str::limit($entry->content, 200) }}</p>
                    @if($entry->ai_insight)
                        <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mt-3">
                            <p class="text-xs font-medium text-indigo-700 mb-1">🤖 AI Insight</p>
                            <p class="text-sm text-indigo-800">{{ $entry->ai_insight }}</p>
                        </div>
                    @endif
                    @if($entry->gratitude)
                        <div class="mt-3 flex flex-wrap gap-2">
                            @foreach($entry->gratitude as $g)
                                <span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">🙏 {{ $g }}</span>
                            @endforeach
                        </div>
                    @endif
                </div>
            @empty
                <div class="card text-center py-12">
                    <p class="text-4xl mb-3">📓</p>
                    <p class="text-gray-500" x-text="lang === 'th' ? 'ยังไม่มีบันทึก เริ่มเขียนวันนี้เลย!' : 'No entries yet. Start writing today!'"></p>
                </div>
            @endforelse
        </div>
    </div>
</x-app-layout>
