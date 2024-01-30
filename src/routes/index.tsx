import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import Page  from "~/components/Page";
import Present from "~/components/Present";
import { timeline } from "~/components/resume";

export default component$(() => {    
  return (
    <>              
        <Present />
        {timeline.sort(function(a, b) {
          return a.startDate > b.startDate ? -1 : 1;
        }).
        map((job, index) => <Page {...job} key={index} />)}                    
    </>
  );
});

export const head: DocumentHead = {
  title: "Engineer, Developer, Leader",
  meta: [
    {
      name: "Resume: Sergei Golos",
      content: "The digital resume of Sergei Golos",
    },
  ],
};
