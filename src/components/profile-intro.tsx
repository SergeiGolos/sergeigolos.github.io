import { resume } from "~/components/resume"
import { Slot, component$ } from "@builder.io/qwik"

export default component$(()=> {
  return <>
  <img
    height={256}
    width={256}
    class="mx-auto h-64 w-64 rounded-full"
    src={resume.basics.image}
  />
  <h1 class="mt-14 font-display text-4xl/tight font-light text-white">
    {resume.basics.name}{' '}<Slot />
  </h1>
  <div class="mt-8 flex justify-center sm:gap-x-2 lg:justify-start">        
  </div>
</>
})