import { resume } from "~/components/resume";
import { Slot, component$ } from "@builder.io/qwik";
import { FaFileArrowDownSolid } from "@qwikest/icons/font-awesome";

export default component$(() => {
  return (
    <>
      <div class="relative mx-auto w-64">
        <img
          height={256}
          width={256}
          class="block h-64 w-64 rounded-full"
          src={resume.basics.webImage}
          alt={`Profile image for ${resume.basics.name}`}
        />
        <a
          href="/sergei-golos-resume.pdf"
          target="_blank"
          rel="noreferrer"
          title="Download résumé (PDF)"
          aria-label="Download résumé (PDF)"
          class="absolute right-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg ring-2 ring-white/25 transition hover:bg-sky-500"
        >
          <FaFileArrowDownSolid class="h-5 w-5" />
        </a>
      </div>
      <h1 class="font-display mt-14 text-4xl/tight font-light text-white">
        {resume.basics.name} <Slot />
      </h1>
      <div class="mt-8 flex justify-center sm:gap-x-2 lg:justify-start"></div>
    </>
  );
});
