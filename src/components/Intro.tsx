import { FaGithub, FaStackOverflow, FaLinkedin } from "@qwikest/icons/font-awesome"
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
        Sergei Golos{' '}<span class="text-sky-300">software enthusiast</span> and <span class="text-sky-300">forever student</span>
      </h1>
      <div class="mt-8 flex justify-center sm:gap-x-2 lg:justify-start">      
                      
      </div>
    </>
  )
}

export function IntroFooter() {
  return (
    <p class="flex items-center gap-x-2 text-[0.8125rem]/6 text-gray-500">
      <Link href="https://github.com/sergeigolos/">
          <span class="flex gap-x-2">
            <FaGithub font-size={24}/>
          </span>
        </Link>
        <Link href="https://stackoverflow.com/users/190188/sergei-golos">
          <span class="flex gap-x-2">
            <FaStackOverflow font-size={24}/>
          </span>
        </Link>
        <Link href="https://www.linkedin.com/in/sergei-golos-11172164/">
          <span class="flex gap-x-2">
            <FaLinkedin font-size={24}/>
          <s></s></span>
        </Link>
    </p>
  )
}
