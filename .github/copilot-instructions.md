# Sergei Golos Portfolio Website

This is a personal portfolio website built with Qwik/QwikCity, TypeScript, and TailwindCSS. The site generates a static portfolio from resume data and deploys to GitHub Pages via GitHub Actions.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and validate the repository:
  - `PUPPETEER_SKIP_DOWNLOAD=true npm install` -- installs dependencies. NEVER CANCEL: Takes 3-5 minutes due to large dependency tree. Set timeout to 10+ minutes.
  - `npm run build` -- full production build including type checking, linting, client build, and static site generation. NEVER CANCEL: Takes 15 seconds. Set timeout to 2+ minutes.
  - `npm run lint` -- ESLint type checking and linting. Takes 5-10 seconds.
  - `npm run fmt.check` -- Prettier code formatting check. Takes 5 seconds.
- Run the development server:
  - ALWAYS run the bootstrapping steps first.
  - `npm start` -- starts Vite dev server with SSR on http://localhost:5173. Takes 2 seconds to start.
  - `npm run preview` -- builds and runs production preview on http://localhost:4173. NEVER CANCEL: Takes 15 seconds. Set timeout to 2+ minutes.
- Build commands:
  - `npm run build.client` -- builds client-side bundle only
  - `npm run build.server` -- builds and generates static site for GitHub Pages deployment
  - `npm run build.types` -- TypeScript type checking only

## Validation

- ALWAYS manually validate any new code by running the development server and testing in a browser.
- ALWAYS run through at least one complete end-to-end scenario after making changes:
  - Load the homepage at http://localhost:5173
  - Test the dark/light theme toggle button
  - Verify the resume PDF link works (should open sergei-golos-resume.pdf)
  - Scroll through the timeline to ensure all content loads correctly
  - Test responsive design by resizing the browser window
- You can build and run both development and preview modes, and should test both when making significant changes.
- ALWAYS run `npm run fmt` and `npm run lint` before you are done or the CI (.github/workflows/main.yml) will fail.
- The build generates a PDF resume from resume.json using the jsonresume-theme-relaxed theme.

## Common Tasks

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Structure

```
├── .github/workflows/main.yml    # CI/CD pipeline for GitHub Pages
├── adapters/static/             # Static site generation config
├── public/                      # Static assets (images, fonts, PDFs)
├── src/
│   ├── components/              # Reusable UI components
│   ├── routes/                  # File-based routing (QwikCity)
│   ├── entry.dev.tsx            # Development entry point
│   ├── entry.preview.tsx        # Preview server entry point
│   ├── entry.ssr.tsx           # SSR entry point
│   ├── global.css              # Global styles
│   └── root.tsx                # Root application component
├── package.json                 # Dependencies and scripts
├── resume.json                  # Resume data for PDF generation
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # TailwindCSS configuration
└── vite.config.ts              # Vite bundler configuration
```

### Key npm Scripts

```json
{
  "build": "qwik build", // Full production build (client + server + types + lint)
  "dev": "vite --mode ssr", // Development server
  "start": "vite --open --mode ssr", // Development server with browser auto-open
  "preview": "qwik build preview && vite preview --open", // Production preview
  "lint": "eslint \"src/**/*.ts*\"", // Code linting
  "fmt": "prettier --write .", // Code formatting
  "fmt.check": "prettier --check ." // Check code formatting
}
```

### Dependencies Overview

- **@builder.io/qwik**: Modern web framework (React-like with resumability)
- **@builder.io/qwik-city**: File-based routing and SSG for Qwik
- **vite**: Fast build tool and dev server
- **typescript**: Static type checking
- **tailwindcss**: Utility-first CSS framework
- **eslint**: Code linting with TypeScript support
- **prettier**: Code formatting
- **resume-cli**: Generates PDF resume from JSON

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/main.yml`) automatically:

1. Installs dependencies with `npm install`
2. Installs resume-cli and theme: `npm install resume-cli jsonresume-theme-relaxed`
3. Generates resume PDF: `npx resume export public/sergei-golos-resume.pdf -t jsonresume-theme-relaxed`
4. Builds static site: `npm run build`
5. Deploys to GitHub Pages

### Known Issues and Workarounds

- **Puppeteer Download Issue**: During `npm install`, puppeteer may fail to download Chromium. Use `PUPPETEER_SKIP_DOWNLOAD=true npm install` to skip the download.
- **Prettier Formatting**: The codebase has formatting issues. Run `npm run fmt` to fix them before committing.
- **ESLint Warnings**: There are 2 non-blocking ESLint warnings in the codebase related to unnecessary conditionals and import types.

### Development Notes

- The site uses QwikCity's file-based routing system in `src/routes/`
- Components are in `src/components/` and follow Qwik's component patterns
- The site supports both dark and light themes with a toggle component
- Resume data is stored in `resume.json` and automatically converted to PDF during build
- The static site is generated to the `dist/` directory for GitHub Pages deployment
- Development server uses SSR (Server-Side Rendering) mode for better development experience

### Validation Scenarios

When making changes, always test these key scenarios:

1. **Homepage Load**: Visit http://localhost:5173 and ensure the portfolio timeline loads completely
2. **Theme Toggle**: Click the theme toggle button and verify dark/light modes work correctly
3. **Resume Link**: Click the resume link and verify the PDF opens correctly
4. **Responsive Design**: Test the layout on different screen sizes
5. **Navigation**: Test any route changes if modifying routing
6. **Build Process**: Ensure `npm run build` completes successfully and generates expected output

### Time Expectations

- **NEVER CANCEL**: `npm install` takes 3-5 minutes due to large dependency tree
- **NEVER CANCEL**: `npm run build` takes ~15 seconds including all checks
- `npm start` starts in ~2 seconds
- `npm run lint` takes ~5-10 seconds
- `npm run fmt` takes ~5 seconds
- Full CI/CD pipeline takes ~2-3 minutes on GitHub Actions
