@props(['href', 'active' => false])

<a href="{{ $href }}"
   class="{{ $active
        ? 'bg-brand-50 text-brand-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' }}
   flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group">

    @isset($icon)
        <span class="{{ $active ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600' }} shrink-0 flex items-center">
            {{ $icon }}
        </span>
    @endisset

    <span class="flex-1">{{ $slot }}</span>

    @if($active)
        <span class="h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0"></span>
    @endif
</a>
