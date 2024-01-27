import { FaGithub, FaStackOverflow, FaLinkedin, FaBlogSolid } from "@qwikest/icons/font-awesome"
import { resume } from "~/components/resume"
import { Link } from "@builder.io/qwik-city"

export function Intro() {
  return (
    <>
      <img
        height={256}
        width={256}
        class="mx-auto h-64 w-64 rounded-full"
        src="https://avatars.githubusercontent.com/u/660992"
      />
      <h1 class="mt-14 font-display text-4xl/tight font-light text-white">
        {resume.basics.name}{' '}<span class="text-sky-300">software enthusiast</span> and <span class="text-sky-300">forever student</span>
      </h1>
      <div class="mt-8 flex justify-center sm:gap-x-2 lg:justify-start">

      </div>
    </>
  )
}

export function IntroFooter() {
  return (
    <div class="flex items-center gap-x-2 text-[0.8125rem]/6 text-gray-500 pointer-events-auto">
      {resume.basics.profiles.map((profile: any, index: number) => {                
        return <Link key={index} href={profile.url}>
          <span class="flex gap-x-2">
            {profile.network == "Blog" && <FaBlogSolid />}
            {profile.network == "GitHub" && <FaGithub />}
            {profile.network == "Stack Overflow" && <FaStackOverflow />}
            {profile.network == "LinkedIn" && <FaLinkedin />}
          </span>
      </Link>
      })}      
    </div>
  )
}