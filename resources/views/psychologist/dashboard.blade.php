<x-app-layout>
    <x-slot:title>แดชบอร์ดนักจิตวิทยา</x-slot:title>

    <div x-data="{ lang: localStorage.getItem('lang') || 'th' }" class="space-y-6">

        <div>
            <h1 class="text-2xl font-bold text-gray-900">💚 <span x-text="lang === 'th' ? 'แดชบอร์ดสุขภาพจิต' : 'Wellbeing Dashboard'"></span></h1>
        </div>

        {{-- Privacy Notice --}}
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <p class="font-semibold mb-1">🔒 <span x-text="lang === 'th' ? 'ข้อมูลเฉพาะผู้ที่ยินยอม' : 'Consent-based Data Only'"></span></p>
            <p x-text="lang === 'th' ? 'ระบบแสดงข้อมูลเฉพาะนักศึกษาที่เปิดการแชร์ข้อมูลสุขภาพจิตในการตั้งค่าความเป็นส่วนตัวเท่านั้น' : 'Data is shown only for students who have enabled wellbeing data sharing in their privacy settings.'"></p>
        </div>

        {{-- Stats --}}
        <div class="grid grid-cols-3 gap-4">
            <div class="card text-center">
                <div class="text-3xl font-bold text-blue-600">{{ $totalConsenting }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'นักศึกษาที่ยินยอม' : 'Consenting Students'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-orange-600">{{ $elevatedRiskCount }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'ความเสี่ยงสูง' : 'Elevated Risk'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-green-600">{{ number_format($avgWellbeing, 1) }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'ค่าเฉลี่ยความเป็นอยู่' : 'Avg Wellbeing Score'"></div>
            </div>
        </div>

        {{-- High-Risk Students --}}
        @if($highRiskStudents->isNotEmpty())
        <div class="card border-red-100">
            <h3 class="font-semibold text-red-700 mb-4">⚠️ <span x-text="lang === 'th' ? 'นักศึกษาที่ต้องติดตามด่วน' : 'Students Requiring Immediate Follow-up'"></span></h3>
            <div class="space-y-3">
                @foreach($highRiskStudents as $student)
                <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                        <p class="font-medium text-gray-800">{{ $student->name }}</p>
                        <p class="text-xs text-gray-500">{{ $student->email }}</p>
                    </div>
                    <span class="badge-high">High Risk</span>
                </div>
                @endforeach
            </div>
        </div>
        @endif

        {{-- All Students --}}
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? '📋 ภาพรวมนักศึกษาทั้งหมด' : '📋 All Students Overview'"></h3>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'นักศึกษา' : 'Student'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'ความเครียด' : 'Stress'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'แรงจูงใจ' : 'Motivation'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'ภาพรวม' : 'Overall'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'ความเสี่ยง Burnout' : 'Burnout Risk'"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($students as $student)
                        <tr class="border-b border-gray-50 hover:bg-gray-50">
                            <td class="py-3">
                                <p class="font-medium text-gray-800">{{ $student->name }}</p>
                                <p class="text-xs text-gray-400">{{ $student->email }}</p>
                            </td>
                            <td class="py-3 text-center">
                                @if($student->latestWellbeing)
                                    <span class="text-sm font-medium {{ $student->latestWellbeing->stress_level >= 7 ? 'text-red-600' : 'text-gray-700' }}">
                                        {{ $student->latestWellbeing->stress_level }}/10
                                    </span>
                                @else
                                    <span class="text-gray-300">—</span>
                                @endif
                            </td>
                            <td class="py-3 text-center text-gray-600">
                                {{ $student->latestWellbeing?->motivation_level ?? '—' }}{{ $student->latestWellbeing ? '/10' : '' }}
                            </td>
                            <td class="py-3 text-center text-gray-600">
                                {{ $student->latestWellbeing?->overall_wellbeing ?? '—' }}{{ $student->latestWellbeing ? '/10' : '' }}
                            </td>
                            <td class="py-3 text-center">
                                @if($student->latestWellbeing)
                                    <span class="badge-{{ $student->latestWellbeing->burnout_risk }}">
                                        {{ $student->latestWellbeing->burnout_risk }}
                                    </span>
                                @else
                                    <span class="text-gray-300 text-xs">no data</span>
                                @endif
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="text-center py-8 text-gray-400" x-text="lang === 'th' ? 'ยังไม่มีนักศึกษาที่ยินยอม' : 'No consenting students yet'"></td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-app-layout>
