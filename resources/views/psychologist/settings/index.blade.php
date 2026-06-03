<x-app-layout>
<x-slot:title>ตั้งค่า</x-slot:title>
<div class="max-w-2xl mx-auto space-y-6">
    <div><h1 class="text-2xl font-bold text-gray-900">ตั้งค่า</h1><p class="text-sm text-gray-400 mt-0.5">จัดการโปรไฟล์และการตั้งค่า</p></div>
    <form method="POST" action="{{ route('psychologist.settings.update') }}" class="space-y-6">
        @csrf
        <div class="bg-white rounded-2xl border border-gray-100 p-6" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <h2 class="text-sm font-bold mb-5 uppercase tracking-wide" style="color:#2D9375;">โปรไฟล์</h2>
            <div class="flex items-center gap-4 mb-6">
                <div class="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0" style="background-color:#7c3aed;">{{ strtoupper(substr(auth()->user()->name, 0, 2)) }}</div>
                <div>
                    <p class="text-base font-bold text-gray-900">{{ auth()->user()->name }}</p>
                    <p class="text-sm text-gray-400">{{ auth()->user()->email }}</p>
                    <span class="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-semibold" style="background-color:#ede9fe; color:#5b21b6;">นักจิตวิทยา</span>
                </div>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">ชื่อ-นามสกุล</label>
                    <input type="text" value="{{ auth()->user()->name }}" disabled class="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                    <p class="text-xs text-gray-400 mt-1">ไม่สามารถแก้ไขชื่อได้ — ข้อมูลจาก KKU SSO</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-600 mb-1.5">อีเมล</label>
                    <input type="text" value="{{ auth()->user()->email }}" disabled class="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 cursor-not-allowed">
                    <p class="text-xs text-gray-400 mt-1">ไม่สามารถแก้ไขอีเมลได้ — ข้อมูลจาก KKU SSO</p>
                </div>
            </div>
        </div>
        <div class="flex justify-end"><button type="submit" class="px-6 py-2 rounded-xl text-white font-medium" style="background-color:#7c3aed;">💾 บันทึก</button></div>
    </form>
</div>
</x-app-layout>
