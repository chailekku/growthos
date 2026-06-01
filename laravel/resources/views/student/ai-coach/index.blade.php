<x-app-layout>
    <x-slot:title>AI โค้ช</x-slot:title>

    <div x-data="aiCoach()" class="max-w-3xl mx-auto space-y-4 flex flex-col h-full">
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span class="text-xl">🤖</span>
            </div>
            <div>
                <h1 class="text-xl font-bold text-gray-900" x-text="lang === 'th' ? 'AI โค้ชส่วนตัว' : 'Personal AI Coach'"></h1>
                <p class="text-xs text-gray-500" x-text="lang === 'th' ? 'คุยกับ AI เพื่อรับคำแนะนำและแรงบันดาลใจ' : 'Chat with AI for guidance and motivation'"></p>
            </div>
        </div>

        {{-- Coach Type Picker --}}
        <div class="flex flex-wrap gap-2">
            @foreach([
                ['type' => 'productivity', 'icon' => '⚡', 'th' => 'ผลิตภาพ', 'en' => 'Productivity'],
                ['type' => 'reflection', 'icon' => '🪞', 'th' => 'สะท้อนคิด', 'en' => 'Reflection'],
                ['type' => 'focus', 'icon' => '🎯', 'th' => 'โฟกัส', 'en' => 'Focus'],
                ['type' => 'wellbeing', 'icon' => '💚', 'th' => 'สุขภาพจิต', 'en' => 'Wellbeing'],
            ] as $c)
            <button @click="coachType = '{{ $c['type'] }}'"
                    :class="coachType === '{{ $c['type'] }}' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'"
                    class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
                {{ $c['icon'] }} <span x-text="lang === 'th' ? '{{ $c['th'] }}' : '{{ $c['en'] }}'"></span>
            </button>
            @endforeach
        </div>

        {{-- Chat Messages --}}
        <div class="card flex-1 overflow-y-auto space-y-4 min-h-96 max-h-[500px]" id="chatBox">
            {{-- Welcome message --}}
            <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">🤖</div>
                <div class="bg-indigo-50 rounded-2xl rounded-tl-none px-4 py-3 max-w-lg">
                    <p class="text-sm text-gray-800" x-text="lang === 'th' ? 'สวัสดีค่ะ! ฉันคือ AI โค้ชส่วนตัวของคุณ พร้อมช่วยเรื่องการเรียน การจัดการเวลา และสุขภาพจิตนะคะ 😊 มีอะไรที่อยากคุยไหมคะ?' : 'Hello! I\'m your personal AI coach, ready to help with studying, time management, and mental wellness 😊 What would you like to talk about?'"></p>
                </div>
            </div>

            <template x-for="msg in messages" :key="msg.id">
                <div :class="msg.role === 'user' ? 'flex-row-reverse' : ''" class="flex items-start space-x-3">
                    <div :class="msg.role === 'user' ? 'bg-indigo-600 text-white ml-3 rounded-br-none' : 'bg-indigo-50 text-gray-800 mr-3 rounded-bl-none'"
                         class="rounded-2xl px-4 py-3 max-w-lg">
                        <p class="text-sm" x-text="msg.content"></p>
                    </div>
                </div>
            </template>

            <div x-show="loading" class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">🤖</div>
                <div class="bg-indigo-50 rounded-2xl rounded-tl-none px-4 py-3">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:0ms"></div>
                        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:150ms"></div>
                        <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:300ms"></div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Input --}}
        <div class="card py-4">
            <div class="flex space-x-3">
                <input type="text" x-model="input"
                       @keyup.enter="sendMessage"
                       :placeholder="lang === 'th' ? 'พิมพ์ข้อความ...' : 'Type a message...'"
                       class="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <button @click="sendMessage" :disabled="loading || !input.trim()"
                        class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    <span x-text="lang === 'th' ? 'ส่ง' : 'Send'"></span>
                </button>
            </div>
            <p class="text-xs text-gray-400 mt-2 text-center" x-text="lang === 'th' ? '⚠️ AI ไม่สามารถวินิจฉัยโรคได้ หากมีปัญหาด้านจิตใจ กรุณาติดต่อนักจิตวิทยาของมหาวิทยาลัย' : '⚠️ AI cannot diagnose. For mental health concerns, please contact university counselor'"></p>
        </div>
    </div>

    <script>
    function aiCoach() {
        return {
            lang: localStorage.getItem('lang') || 'th',
            coachType: 'productivity',
            messages: [],
            input: '',
            loading: false,
            msgId: 0,
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
                        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content },
                        body: JSON.stringify({ message: userMsg, coach_type: this.coachType })
                    });
                    const data = await res.json();
                    this.messages.push({ id: ++this.msgId, role: 'assistant', content: data.response });
                } catch(e) {
                    this.messages.push({ id: ++this.msgId, role: 'assistant', content: this.lang === 'th' ? 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' : 'Sorry, an error occurred. Please try again.' });
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
