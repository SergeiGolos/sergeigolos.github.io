import type { TimeLineEntryProperties } from "./TimeLineEntryProperties";
const result: any = import.meta.glob('/resume.json', {
  import: 'default',
  as: 'raw',
  eager: true, // defaults to false
});

const details: any =  {};
const loaded =  import.meta.glob('/src/routes/history/**.mdx', {
  import: 'default',
  as: 'raw',
  eager: true, // defaults to false
});

for (const key in loaded) {
  const newKey = key.replace('/src/routes/history/', '').replace('index.mdx', '');
  console.log(key, newKey);    
  details[newKey] = loaded[key];
}

console.log(details);

const resume = JSON.parse(result['/resume.json']);

const timeline : TimeLineEntryProperties[] = []
// work history  
.concat(resume.work.map((job: any) => { return { 
    name: job.position, 
    type: "work",
    ...job 
  }}))

  // project history
  .concat(resume.projects.map((project: any) => { return { 
    copmanyLogo: "", 
    company : "GitHub",
    type: "project",
    ...project 
  }}))

  // school history
  .concat(resume.education.map((education: any) => { return { 
    copmanyLogo: "",       
    company : education.institution,
    type: "education",
    name: education.studyType,
    ...education } as TimeLineEntryProperties}));    


export { resume, timeline, details }