import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import Intro from "~/components/profile-intro";
import Profile from "~/components/profiles";
import Page  from "~/components/Page";
import Present from "~/components/Present";
import { ThemeToggle } from "~/components/ThemeToggle";
import { timeline } from "~/components/resume";
import ResumeLink from "~/components/resume-link";

export function Glow() {
  const id = "testUd";

  return (
    <div class="absolute inset-0 -z-10 overflow-hidden bg-gray-950 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem]">
      <svg
        class="absolute -bottom-48 left-[-40%] h-[80rem] w-[180%] lg:-right-40 lg:bottom-auto lg:left-auto lg:top-[-40%] lg:h-[180%] lg:w-[80rem]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${id}-desktop`} cx="100%">
            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.3)" />
            <stop offset="53.95%" stop-color="rgba(0, 71, 255, 0.09)" />
            <stop offset="100%" stop-color="rgba(10, 14, 23, 0)" />
          </radialGradient>
          <radialGradient id={`${id}-mobile`} cy="100%">
            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.3)" />
            <stop offset="53.95%" stop-color="rgba(0, 71, 255, 0.09)" />
            <stop offset="100%" stop-color="rgba(10, 14, 23, 0)" />
          </radialGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-desktop)`}
          class="hidden lg:block"
        />
        <rect
          width="100%"
          height="100%"
          fill={`url(#${id}-mobile)`}
          class="lg:hidden"
        />
      </svg>
      <div class="absolute inset-x-0 bottom-0 right-0 h-px bg-white mix-blend-overlay lg:left-auto lg:top-0 lg:h-auto lg:w-px" />
    </div>
  )
}

export function Timeline() {
  const id = "timeline";

  return (
    <div class="pointer-events-none absolute inset-0 z-50 overflow-hidden lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-visible">
      <svg
        class="absolute left-[max(0px,calc(50%-18.125rem))] top-0 h-full w-1.5 lg:left-full lg:ml-1 xl:left-auto xl:right-1 xl:ml-0"
        aria-hidden="true"
      >
        <defs>
          <pattern id={id} width="6" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M0 0H6M0 8H6"
              class="stroke-sky-900/10 xl:stroke-white/10 dark:stroke-white/10"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  )
}

export default component$(() => {    
  return (
    <>    
      <div class="relative flex-none overflow-hidden px-6 lg:pointer-events-none lg:fixed lg:inset-0 lg:flex lg:px-0 bg-gray-900 lg:bg-transparent" >
        <Glow /> 
        <div class="relative flex w-full lg:pointer-events-auto         
        lg:mr-[calc(max(2rem,50%-38rem))] lg:min-w-[32rem] lg:overflow-y-auto lg:overflow-x-hidden lg:pl-2">
          <div class="mx-auto max-w-lg md:mx-64 lg:mx-[calc(max(2rem,50%-32rem))] lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6">
            <div class="pb-16 pt-20 sm:pb-20 sm:pt-32 lg:py-20">
              <div class="relative content-center">
                <Intro>
                  <span class="text-sky-300">software enthusiast</span> and <span class="text-sky-300">forever student</span>
                </Intro>
              </div>
            </div>
            <div class="flex flex-1 items-end justify-center pb-4 lg:justify-center lg:pb-6 lg:z-40">
              <Profile />
            </div>
          </div>
        </div>
      </div>                      
      <ThemeToggle />      
      <ResumeLink href="sergei-golos-resume.pdf" />
      <div class="relative flex-auto pointer-events-none">
        <Timeline />
        <main class="space-y-2 py-20 sm:space-y-2 sm:py-8">
          <Present />
          {timeline.sort(function(a, b) {
            return a.startDate > b.startDate ? -1 : 1;
          }).
          map((job, index) => <Page {...job} key={index} />)}          
        </main>        
      </div>    
    </>
  );
});

export const head: DocumentHead = {
  title: "Engineer, Developer, Leader",
  meta: [
    {
      name: "Resume: Sergei Golos",
      content: "The digital resume of Sergei Golos",
    },
  ],
};
