import { useSignal, $ } from "@builder.io/qwik"

function ThemeIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-5-8a5 5 0 0 0 5 5V7a5 5 0 0 0-5 5Z"
      />
    </svg>
  )
}

export function ThemeToggle() {
   
   const item = "dark";
   const otherTheme = item  === 'dark' ? 'light' : 'dark'

//   useSignal(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     return null
//   }

  return (
    <button
      type="button"
      class="group absolute right-4 top-4 z-50 -m-2.5 p-2.5"
      onClick$={$(() => console.log(otherTheme))}
    >
      <span class="sr-only">Switch to {otherTheme} theme</span>
      <ThemeIcon class="h-6 w-6 fill-white opacity-50 transition-opacity group-hover:opacity-100 lg:fill-gray-900 lg:dark:fill-white" />
    </button>
  )
}