import { Link } from "@builder.io/qwik-city"

export function Intro() {
  return (
    <>
      <span class="relative inline-block mx-auto">
        <img class="h-64 w-64 rounded-full" src="https://avatars.githubusercontent.com/u/660992" />
        <span class="absolute bottom-4 right-42 block h-8 w-8 rounded-full bg-green-400 ring-2 ring-white"></span>
      </span>
      <h1 class="mt-14 font-display text-4xl/tight font-light text-white">
        Sergei Golos{' '}<span class="text-sky-300">software enthusiast</span> and <span class="text-sky-300">forever student</span>
      </h1>
      <div class="mt-8 flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 lg:justify-start">
        {/* <IconLink href="#" icon={BookIcon} className="flex-none">
          Documentation
        </IconLink>
        <IconLink href="#" icon={GitHubIcon} className="flex-none">
          GitHub
        </IconLink>
        <IconLink href="/feed.xml" icon={FeedIcon} className="flex-none">
          RSS
        </IconLink> */}
      </div>
    </>
  )
}

export function IntroFooter() {
  return (
    <p class="flex items-baseline gap-x-2 text-[0.8125rem]/6 text-gray-500">
      Brought to you by{' '}
      <Link href="https://github.com/sergeigolos/">
        Sergei Golos
      </Link>
    </p>
  )
}
