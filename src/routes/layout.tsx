import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Profile from "~/components/profiles";
import ThemeToggle from "~/components/light-dark-toggle";
import styles from "./styles.css?inline";
import Glow from "~/components/glow";
import ResumeLink from "~/components/resume-link";
import Timeline from "~/components/timeline";
import ProfileIntro from "~/components/profile-intro";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.builder.io/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <main class="flex min-h-full flex-col bg-white dark:bg-gray-950">
        <div class="relative flex-none overflow-hidden px-6 lg:pointer-events-none lg:fixed lg:inset-0 lg:flex lg:px-0 bg-gray-900 lg:bg-transparent" >
          <Glow />
          <div class="relative flex w-full lg:pointer-events-auto         
        lg:mr-[calc(max(2rem,50%-38rem))] lg:min-w-[32rem] lg:overflow-y-auto lg:overflow-x-hidden lg:pl-2">
            <div class="mx-auto max-w-lg md:mx-64 lg:mx-[calc(max(2rem,50%-32rem))] lg:flex lg:w-96 lg:max-w-none lg:flex-col lg:before:flex-1 lg:before:pt-6">
              <div class="pb-16 pt-20 sm:pb-20 sm:pt-32 lg:py-20">
                <div class="relative content-center">
                  <ProfileIntro >
                    <span class="text-sky-300">software enthusiast</span> and <span class="text-sky-300">forever student</span>      
                  </ProfileIntro>                
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
            <main class="space-y-2 py-8 lg:py-20 sm:space-y-2 sm:py-8">
              <Slot />    
          </main>
        </div>
      </main>
    </>
  );
});
