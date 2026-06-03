<x-app-layout>
<x-slot:title>Course Management</x-slot:title>

<div class="space-y-6">
    {{-- Header --}}
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">📚 Course Management</h1>
            <p class="text-sm text-gray-400 mt-0.5">Total Courses: 10</p>
        </div>
        <button class="px-4 py-2 rounded-xl text-white font-medium" style="background-color:#FF9500;">+ Add Course</button>
    </div>

    {{-- 4 Stat Cards --}}
    <div class="grid grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="text-3xl font-bold text-orange-600">10</div>
            <div class="text-xs text-gray-500 font-medium mt-1">Total Courses</div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="text-3xl font-bold text-teal-600">10</div>
            <div class="text-xs text-gray-500 font-medium mt-1">Active Courses</div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="text-3xl font-bold text-blue-600">16</div>
            <div class="text-xs text-gray-500 font-medium mt-1">Total Enrollments</div>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
            <div class="text-3xl font-bold text-purple-600">1.6</div>
            <div class="text-xs text-gray-500 font-medium mt-1">Avg Enrollment</div>
        </div>
    </div>

    {{-- Search + Filters --}}
    <div class="bg-white rounded-2xl border border-gray-100 p-5" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <div class="flex items-center gap-4">
            <input type="text" placeholder="Search..." class="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm" />
            <select class="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white">
                <option>All Categories</option>
            </select>
            <select class="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white">
                <option>All Status</option>
            </select>
        </div>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden" style="box-shadow:0 2px 8px rgba(0,0,0,.06)">
        <table class="w-full text-sm">
            <thead class="border-b border-gray-100 bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Course Code</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Course Name</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Credits</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Category</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Semester</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Instructor</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Enrolled</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th class="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-3"><span class="inline-flex items-center gap-2"><span class="h-3 w-3 rounded-full" style="background-color:#6366f1;"></span><span class="font-medium">ENG302</span></span></td>
                    <td class="px-6 py-3">Computer Networks</td>
                    <td class="px-6 py-3"><span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style="background-color:#fee2e2; color:#991b1b;">3</span></td>
                    <td class="px-6 py-3"><span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style="background-color:#fee2e2; color:#991b1b;">Required</span></td>
                    <td class="px-6 py-3">2nd Sem/2025</td>
                    <td class="px-6 py-3">Dr. Somchai Prasert</td>
                    <td class="px-6 py-3">1</td>
                    <td class="px-6 py-3"><span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold" style="background-color:#d1fae5; color:#065f46;">Active</span></td>
                    <td class="px-6 py-3"><button class="text-gray-400 hover:text-gray-600">✏️</button> <button class="text-gray-400 hover:text-gray-600">🗑️</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</x-app-layout>
