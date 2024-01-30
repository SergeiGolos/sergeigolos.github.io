import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { FaDownloadSolid } from "@qwikest/icons/font-awesome";

export default component$((params : {href: string}) => {    
    return (
        <Link target="_blank"
              href={params.href}
              class="group absolute right-14 top-3 z-50 p-2 font-semibold
            lite:lg:bg-white lg:text-gray-500 lg:hover:text-gray-900
            text-white/50 hover:text-white/90
            lg:dark:text-white/50 lg:dark:hover:text-white/90">
              <FaDownloadSolid height={20} width={20} />
        </Link>)
});