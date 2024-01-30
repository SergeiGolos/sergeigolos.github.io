import { resume } from "~/components/resume"
import { Link } from "@builder.io/qwik-city"
import { component$ } from "@builder.io/qwik";
import { FaBlogSolid, FaGithub, FaLinkedin, FaStackOverflow } from "@qwikest/icons/font-awesome";

export default component$(() => {
    return (<>
    <div class="flex items-center gap-x-2 text-[0.8125rem]/6 text-gray-500 pointer-events-auto">
      {resume.basics.profiles.map((profile: any, index: number) => {                
        return <Link key={index} href={profile.url} aria-label={`Link to ${profile.username} profile on ${profile.network}`}>
          <span class="flex gap-x-2 text-lg">
            {profile.network == "Blog" && <FaBlogSolid />}
            {profile.network == "GitHub" && <FaGithub />}
            {profile.network == "Stack Overflow" && <FaStackOverflow />}
            {profile.network == "LinkedIn" && <FaLinkedin />}
          </span>
      </Link>
      })}      
    </div>
    </>)
});