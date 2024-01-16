import { component$ } from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"
export interface TimeLineEntryProperties {
  summary: string
  name: string,
  startDate: string
  highlights: string[],
  company: string,
  url?: string,
  copmanyLogo?: string,
}

export default component$((props: TimeLineEntryProperties) => {
  return (
    <article id="commit-message-suggestions" class="">
      <div>    
        <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8 text-gray-400" >
          <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
            <div class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto leading-8" data-mdx-content="true">
              <div class="relative mt-8 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 [&amp;+*]:mt-8">               
                <div
                  class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10">
                </div>
              </div>
              <h3 class="text-blue-400 dark:text-white/50 text-xl">
                {props.name} @ <Link href={props.url}>{props.company}</Link>
              </h3>              
              <p>{props.summary}</p>
              {/* <h3 id="-improvements"><svg viewBox="0 0 16 16" aria-hidden="true">
              <path fill="#38BDF8"
                d="M5.338 9.805c.11.418.439.747.857.857C7.282 10.948 8 11.44 8 12s-.718 1.052-1.805 1.338c-.418.11-.747.439-.857.857C5.052 15.281 4.56 16 4 16s-1.052-.718-1.338-1.805a1.205 1.205 0 0 0-.856-.857C.718 13.052 0 12.56 0 12s.718-1.052 1.806-1.338c.417-.11.746-.439.856-.857C2.948 8.718 3.441 8 4 8c.56 0 1.052.718 1.338 1.805Z">
              </path>
              <path fill="#7DD3FC"
                d="M12.717 2.432c.1.42.43.75.85.852C15.026 3.633 16 4.27 16 5s-.975 1.367-2.432 1.716c-.42.101-.75.432-.851.852C12.367 9.025 11.729 10 11 10c-.729 0-1.367-.975-1.716-2.432-.101-.42-.431-.75-.851-.852C6.975 6.367 6 5.73 6 5c0-.73.975-1.367 2.433-1.717.42-.1.75-.43.85-.85C9.634.974 10.272 0 11 0c.73 0 1.367.975 1.717 2.432Z">
              </path>
            </svg> Improvements</h3> */}
              <h4 class="mt-5 font-bold">Highlights</h4>
              <ul class="list-disc">
                {props.highlights.map((item, index) => (<li key={index}>{item}</li>))}
              </ul>
            </div>            
          </div>          
        </div>
        <header class="relative mt-2 sm:mt-8 xl:mb-0">
          <div
            class="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8">            
              <time data-datetime={props.startDate}
                class="hidden xl:pointer-events-auto xl:block xl:text-2xs/4 xl:font-medium xl:text-white/50">{props.startDate} </time>            
            <div class="h-[0.0625rem] w-3.5 bg-gray-400 lg:-mr-3.5 xl:mr-0 xl:bg-gray-300">              
            </div>            
          </div>          
          <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
            <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">              
              <div class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">                
                <div class="flex">                  
                    <time data-datetime={props.startDate}
                    class="text-2xs/4 font-medium text-gray-500 xl:hidden dark:text-white/50">{props.startDate}</time>                  
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </article>
  )
})
