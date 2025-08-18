# Sergei Golos - Digital Portfolio & Resume ⚡️

**A modern, high-performance portfolio website built with next-generation web technologies**

[![Live Site](https://img.shields.io/badge/Live-Portfolio-blue?style=for-the-badge&logo=github-pages)](https://sergeigolos.github.io/)
[![Resume PDF](https://img.shields.io/badge/Download-Resume-green?style=for-the-badge&logo=adobe-acrobat-reader)](https://sergeigolos.github.io/sergei-golos-resume.pdf)

---

## 🎯 Professional Overview

This repository serves as both my professional calling card and a demonstration of modern web development practices. The site combines cutting-edge technology with thoughtful design to create a fast, accessible, and maintainable digital portfolio.

### ✨ Key Features

- **⚡ Lightning Fast**: Built with [Qwik](https://qwik.builder.io/) for instant loading and optimal performance
- **📱 Responsive Design**: Seamless experience across all devices using TailwindCSS
- **🌓 Dual Theme Support**: Professional dark and light modes with persistent user preference
- **📋 JSON Resume Integration**: Single source of truth using the industry-standard [JSON Resume](https://jsonresume.org/) format
- **🎯 Interactive Timeline**: Filterable career history with advanced search capabilities
- **📄 Automated PDF Generation**: Professional resume automatically generated from the same data source
- **🚀 Static Site Generation**: Pre-rendered HTML for optimal SEO and performance
- **♿ Accessibility First**: Built with accessibility best practices and semantic HTML

## 🏗️ Architecture & Technology Stack

### Modern Web Framework

- **[Qwik](https://qwik.builder.io/)**: Next-generation framework with resumability for zero hydration overhead
- **[QwikCity](https://qwik.builder.io/qwikcity/overview/)**: File-based routing and static site generation
- **[TypeScript](https://www.typescriptlang.org/)**: Full type safety throughout the codebase
- **[Vite](https://vitejs.dev/)**: Lightning-fast development and build tooling

### Styling & Design

- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development
- **Responsive Layout**: Mobile-first design with sophisticated breakpoint management
- **Custom Animations**: Smooth transitions and engaging visual elements

### Data Management

- **JSON Resume Format**: Industry-standard resume schema for portability and consistency
- **Static Generation**: All content pre-rendered at build time for optimal performance
- **PDF Generation**: Automated resume creation using [`jsonresume-theme-relaxed`](https://github.com/rbardini/jsonresume-theme-relaxed)

## 🚀 The JSON Resume Advantage

This portfolio leverages the [JSON Resume](https://jsonresume.org/) open-source initiative, providing:

- **📊 Structured Data**: Resume information in machine-readable format
- **🔄 Version Control**: Career history tracked with full Git history
- **📋 Format Flexibility**: Same data generates web portfolio, PDF resume, and potential future formats
- **🌍 Industry Standard**: Compatible with JSON Resume ecosystem and tools
- **🔍 SEO Benefits**: Structured data enhances search engine understanding

The `resume.json` file serves as the single authoritative source for all career information, ensuring consistency across all formats and eliminating data duplication.

## 🎨 Design Philosophy

The site embodies modern professional web design principles:

- **Performance First**: Sub-second load times with minimal JavaScript
- **Content Focused**: Clean, readable typography that highlights professional experience
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility Minded**: WCAG compliant with keyboard navigation and screen reader support
- **Mobile Optimized**: Touch-friendly interface with responsive breakpoints

## ⚙️ Development Workflow

### Quick Start

```bash
# Install dependencies (may take 3-5 minutes due to comprehensive tooling)
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Start development server with hot reload
npm start

# Build production site with PDF generation
npm run build

# Preview production build locally
npm run preview
```

### Build Process

The sophisticated build pipeline includes:

1. **TypeScript Compilation**: Full type checking and compilation
2. **Client Bundle**: Optimized JavaScript with code splitting
3. **Static Site Generation**: Pre-rendered HTML for all routes
4. **PDF Resume Generation**: Automated creation from JSON Resume data
5. **Asset Optimization**: Image optimization and CSS purification
6. **Code Quality Checks**: ESLint and Prettier validation

## 🚀 Deployment & CI/CD

The site employs a fully automated deployment pipeline:

1. **Continuous Integration**: GitHub Actions workflow triggers on every push
2. **Dependency Installation**: Automated package management
3. **Resume Generation**: PDF creation using `resume-cli` and `jsonresume-theme-relaxed`
4. **Site Build**: Complete static site generation
5. **GitHub Pages Deploy**: Automatic deployment to custom domain
6. **Performance Monitoring**: Built-in analytics and performance tracking

## 📊 Performance Metrics

This portfolio is optimized for exceptional performance:

- **🎯 Lighthouse Score**: Near-perfect scores across all metrics
- **⚡ First Contentful Paint**: < 1 second
- **📱 Mobile Optimized**: Responsive design with touch-friendly interactions
- **♿ Accessibility**: WCAG 2.1 AA compliance
- **🔍 SEO Ready**: Semantic HTML with structured data markup

## 🛠️ Technical Implementation

### Project Structure

```
├── .github/workflows/       # CI/CD automation
├── public/                  # Static assets and generated PDF
├── src/
│   ├── components/         # Reusable UI components
│   ├── routes/            # File-based routing structure
│   └── global.css         # Global styles and theme variables
├── resume.json            # JSON Resume data (single source of truth)
├── package.json           # Dependencies and build scripts
└── tailwind.config.js     # Design system configuration
```

### Key Components

- **Timeline Interface**: Interactive career history with filtering
- **Theme Management**: Persistent dark/light mode with smooth transitions
- **Resume Integration**: Seamless PDF download functionality
- **Filter System**: Advanced search and categorization capabilities
- **Mobile Navigation**: Touch-optimized interface patterns

## 🎓 Learning & Exploration

This project serves as a practical exploration of:

- **Modern Web Standards**: Latest browser APIs and web platform features
- **Performance Optimization**: Techniques for minimal loading times
- **Static Site Generation**: Benefits and implementation of JAMstack architecture
- **Developer Experience**: Modern tooling for efficient development workflows
- **Accessibility Engineering**: Inclusive design principles in practice

## 📞 Connect

This portfolio represents my commitment to modern web development practices and continuous learning. Feel free to explore the codebase, suggest improvements, or reach out for professional opportunities.

**Live Portfolio**: [sergeigolos.github.io](https://sergeigolos.github.io/)  
**Resume PDF**: [Download Latest](https://sergeigolos.github.io/sergei-golos-resume.pdf)

---

_Built with ❤️ using Qwik, TypeScript, and modern web technologies_
