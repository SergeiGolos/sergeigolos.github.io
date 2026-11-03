import type { TimeLineEntryProperties } from "./TimeLineEntryProperties";
const result: any = import.meta.glob("/resume.json", {
  query: "?raw",
  import: "default",
  eager: true,
});

const resume = JSON.parse(result["/resume.json"]);

const timeline: TimeLineEntryProperties[] = []
  // work history
  .concat(
    resume.work.map((job: any) => {
      return {
        name: job.position,
        type: "work",
        ...job,
      };
    }),
  )

  // project history
  .concat(
    resume.projects.map((project: any) => {
      return {
        companyLogo: "",
        company: "GitHub",
        type: "project",
        ...project,
      };
    }),
  )

  // school history
  .concat(
    resume.education.map((education: any) => {
      return {
        companyLogo: "",
        company: education.institution,
        type: "education",
        name: education.studyType,
        ...education,
      } as TimeLineEntryProperties;
    }),
  );

export { resume, timeline };
