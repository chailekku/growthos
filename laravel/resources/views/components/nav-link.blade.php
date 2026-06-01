@props(['href', 'icon' => '', 'active' => false])

<a href="{{ $href }}"
   class="{{ $active
     ? 'bg-white/20 text-white'
     : 'text-indigo-200 hover:bg-white/10 hover:text-white' }}
   flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
    @if($icon)
        <span class="text-base w-5 text-center">{{ $icon }}</span>
    @endif
    <span>{{ $slot }}</span>
</a>
