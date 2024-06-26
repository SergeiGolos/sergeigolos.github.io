import { component$ } from "@builder.io/qwik"
import { Link } from "@builder.io/qwik-city"
import type { TimeLineEntryProperties } from "./TimeLineEntryProperties"
export default component$((props: TimeLineEntryProperties) => {
  const date = new Date(props.startDate);
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const dateString = formatter.format(date);
  
  return (
    <article id="commit-message-suggestions" class="">
      <div>    
        <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8 text-gray-500 dark:text-white-500" >
          <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
            <div class="pointer-events-auto mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto leading-8" data-mdx-content="true">
              <div class="relative mt-8 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 [&amp;+*]:mt-8">               
                <div
                  class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10">
                </div>
              </div>
              <h3 class="text-blue-400 text-xl flex  gap-1 lg:gap-1e">
                <span>{props.name}</span>
                <span>@</span>
                <Link target="blank" href={props.url}>{props.company}</Link>
              </h3>              
              <p>{props.summary || props.description}</p>
              <ul class="list-disc">
                {props.highlights.map((item, index) => (<li key={index}>{item}</li>))}
              </ul>
            </div>            
          </div>          
        </div>
        <header class="relative mt-2 sm:mt-8 xl:mb-0">
          <div
            class="pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8">            
              <time data-datetime={date}
                class="hidden xl:pointer-events-auto xl:block xl:text-2xs/4 xl:font-medium xl:text-white/50">{dateString} </time>            
            <div class="h-[0.0625rem] w-3.5 bg-gray-400 lg:-mr-3.5 xl:mr-0 xl:bg-gray-300">              
            </div>            
          </div>          
          <div class="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
            <div class="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">              
              <div class="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto">                
                <div class="flex">                  
                    <time data-datetime={date}
                    class="text-2xs/4 font-medium text-gray-500 xl:hidden dark:text-white/50">{dateString}</time>                  
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </article>
  )
})
