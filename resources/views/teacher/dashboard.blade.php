<x-app-layout>
    <x-slot:title>แดชบอร์ดอาจารย์</x-slot:title>

    <div x-data="{ lang: localStorage.getItem('lang') || 'th' }" class="space-y-6">

        <div>
            <h1 class="text-2xl font-bold text-gray-900">
                <span x-text="lang === 'th' ? 'สวัสดี' : 'Hello'"></span>,
                {{ auth()->user()->name }} 👋
            </h1>
            <p class="text-gray-500 text-sm" x-text="lang === 'th' ? 'ภาพรวมการมีส่วนร่วมของนักศึกษา' : 'Student engagement overview'"></p>
        </div>

        {{-- Stats --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="card text-center">
                <div class="text-3xl font-bold text-indigo-600">{{ $totalStudents }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'นักศึกษาทั้งหมด' : 'Total Students'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-green-600">{{ $activeStudents }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'แอคทีฟสัปดาห์นี้' : 'Active This Week'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-red-600">{{ $atRiskCount }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'ต้องการความช่วยเหลือ' : 'At Risk'"></div>
            </div>
            <div class="card text-center">
                <div class="text-3xl font-bold text-purple-600">{{ number_format($avgEngagement, 0) }}</div>
                <div class="text-xs text-gray-500 mt-1" x-text="lang === 'th' ? 'คะแนน Engagement เฉลี่ย' : 'Avg Engagement Score'"></div>
            </div>
        </div>

        {{-- Students Table --}}
        <div class="card">
            <h3 class="font-semibold text-gray-800 mb-4" x-text="lang === 'th' ? '👥 ภาพรวมนักศึกษา' : '👥 Student Overview'"></h3>

            {{-- At-Risk Alert --}}
            @if($atRiskStudents->isNotEmpty())
            <div class="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p class="text-sm font-semibold text-red-700 mb-2">
                    ⚠️ <span x-text="lang === 'th' ? 'นักศึกษาที่ต้องการความช่วยเหลือ' : 'Students Needing Attention'"></span>
                </p>
                <div class="flex flex-wrap gap-2">
                    @foreach($atRiskStudents as $student)
                        <span class="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full">
                            {{ $student->name }}
                        </span>
                    @endforeach
                </div>
            </div>
            @endif

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'นักศึกษา' : 'Student'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'Engagement' : 'Engagement'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'โฟกัสสัปดาห์นี้' : 'Weekly Focus'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'งานเสร็จ' : 'Tasks Done'"></th>
                            <th class="text-center py-3 text-gray-500 font-medium" x-text="lang === 'th' ? 'ความเสี่ยง' : 'Risk Level'"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($students as $student)
                        <tr class="border-b border-gray-50 hover:bg-gray-50">
                            <td class="py-3">
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                                        {{ strtoupper(substr($student->name, 0, 1)) }}
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-800">{{ $student->name }}</p>
                                        <p class="text-xs text-gray-400">{{ $student->email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="py-3 text-center">
                                <div class="flex items-center justify-center">
                                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                        <div class="h-2 rounded-full {{ $student->engagement_score >= 70 ? 'bg-green-500' : ($student->engagement_score >= 40 ? 'bg-yellow-500' : 'bg-red-500') }}"
                                             style="width: {{ $student->engagement_score }}%"></div>
                                    </div>
                                    <span class="text-xs font-medium">{{ $student->engagement_score }}</span>
                                </div>
                            </td>
                            <td class="py-3 text-center text-gray-600">{{ $student->weekly_focus_minutes ?? 0 }} <span x-text="lang === 'th' ? 'นาที' : 'min'"></span></td>
                            <td class="py-3 text-center text-gray-600">{{ $student->tasks_completed ?? 0 }}</td>
                            <td class="py-3 text-center">
                                <span class="badge-{{ $student->risk_level }}">{{ $student->risk_level }}</span>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="text-center py-8 text-gray-400" x-text="lang === 'th' ? 'ไม่มีข้อมูลนักศึกษา' : 'No student data'"></td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-app-layout>
