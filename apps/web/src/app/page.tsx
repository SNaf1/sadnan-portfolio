"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { portfolioData, Project } from "@/data/portfolio";
import { TiltCard } from "@/components/TiltCard";
import { ProjectModal } from "@/components/ProjectModal";
import { 
  Sun, 
  Moon, 
  Github, 
  Linkedin, 
  Mail, 
  FileDown, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Send,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Form validation schema with Zod
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function PortfolioHome() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fire-and-forget analytics event helper ───────────────────────────────
  const trackEvent = (eventType: string, details?: string) => {
    fetch("/api/tracking/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, details }),
    }).catch(() => { /* silent — never block UI */ });
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sectionsRef = {
    hero: useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    experience: useRef<HTMLElement>(null),
    skills: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  };

  // 1. Dark/Light Theme Handler (Class-based Selector Variant)
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") as "light" | "dark" | null;
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
      trackEvent("TOGGLE_THEME", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("portfolio-theme", "light");
      trackEvent("TOGGLE_THEME", "light");
    }
  };

  // 2. Scrollspy - Highlight Active Section in Sticky Navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // Offset for header

      for (const [sectionName, ref] of Object.entries(sectionsRef)) {
        const element = ref.current;
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionName);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Contact Form Submission
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmitForm = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setFormStatus({
          type: "success",
          message: "Thank you! Your message has been sent directly to my inbox.",
        });
        reset();
      } else {
        throw new Error(result.error || "Failed to submit form");
      }
    } catch (err: any) {
      setFormStatus({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll to section helper
  const scrollTo = (sectionName: keyof typeof sectionsRef) => {
    const element = sectionsRef[sectionName].current;
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Project Scroll controls
  const scrollProjects = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 450;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      
      {/* Sticky Header & Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo / Name */}
          <button 
            onClick={() => scrollTo("hero")}
            className="text-lg font-black tracking-tighter uppercase text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-500"
          >
            S. Nafis
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {["projects", "experience", "skills", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item as any)}
                className={`text-xs font-black uppercase tracking-wider transition-colors duration-200 pb-1 border-b-2 ${
                  activeSection === item
                    ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Actions (Socials + Toggle + CV) */}
          <div className="flex items-center space-x-4">
            <a
              href={portfolioData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label="GitHub Profile"
              onClick={() => trackEvent("SOCIAL_CLICK", "github")}
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href={portfolioData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label="LinkedIn Profile"
              onClick={() => trackEvent("SOCIAL_CLICK", "linkedin")}
            >
              <Linkedin className="h-5 w-5" />
            </a>

            {/* Simple Minimal Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <a
              href={portfolioData.resumePath}
              download="Sadnan_Nafis_CV.pdf"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-600 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-blue-500 dark:hover:text-white"
              onClick={() => trackEvent("DOWNLOAD_CV", "header")}
            >
              CV
              <FileDown className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HERO SECTION - Left-Aligned Stacked Editorial Layout */}
        <section
          id="hero"
          ref={sectionsRef.hero}
          className="flex flex-col justify-start items-start pt-10 pb-16 sm:pt-16 sm:pb-24 max-w-4xl"
        >
          {/* Premium Circular Avatar Frame (Stacked Left Above text) */}
          <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-xl shadow-blue-500/5 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 mb-8">
            <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-white dark:border-zinc-950">
              <img 
                src="/Sadnan Nafis pic.png" 
                alt="Sadnan Nafis Portrait" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -inset-1 rounded-full border border-blue-500/10 pointer-events-none hover:border-blue-500/20" />
          </div>

          {/* Info Side */}
          <div className="w-full">
            {/* Tagline */}
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">
              {portfolioData.location}
            </p>

            {/* Shimmer Text Gradient for Name (Giant) */}
            <h1 className="mb-2 text-5xl font-black tracking-tighter uppercase leading-none sm:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-zinc-900 via-blue-600 to-zinc-900 bg-clip-text text-transparent dark:from-zinc-100 dark:via-blue-450 dark:to-zinc-100 animate-text-shimmer bg-[length:200%_auto]">
                {portfolioData.name}.
              </span>
            </h1>

            {/* Smaller, Sleeker Subtitle */}
            <h2 className="mb-6 text-lg font-extrabold tracking-tight text-zinc-500 dark:text-zinc-450 sm:text-xl uppercase tracking-wide">
              {portfolioData.title}
            </h2>

            {/* Professional Summary */}
            <p className="mb-8 text-sm leading-relaxed text-zinc-650 dark:text-zinc-400 sm:text-base max-w-3xl">
              {portfolioData.profileSummary}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href={portfolioData.resumePath}
                download="Sadnan_Nafis_CV.pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-blue-500 dark:hover:text-white"
                onClick={() => trackEvent("DOWNLOAD_CV", "hero")}
              >
                Download Resume
                <FileDown className="h-4 w-4" />
              </a>

              <button
                onClick={() => scrollTo("contact")}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-zinc-855 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                Let's Talk
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION - Horizontal Scroll List */}
        <section
          id="projects"
          ref={sectionsRef.projects}
          className="border-t border-zinc-200 py-16 dark:border-zinc-900 lg:py-24"
        >
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">
                Selected Works
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-tight uppercase text-zinc-900 dark:text-zinc-50">
                Projects & Research
              </h2>
            </div>
            
            {/* Scroll Buttons */}
            <div className="mt-4 flex gap-2 md:mt-0">
              <button
                onClick={() => scrollProjects("left")}
                className="rounded-xl border border-zinc-200 p-2 text-zinc-655 hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollProjects("right")}
                className="rounded-xl border border-zinc-200 p-2 text-zinc-655 hover:bg-zinc-50 dark:border-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Layout (Exactly 3 cards fit perfectly on desktop) */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-4 px-2 no-scrollbar snap-x snap-mandatory"
          >
            {portfolioData.projects.map((project) => (
              <div 
                key={project.id} 
                className="w-[290px] sm:w-[380px] lg:w-[calc((100%-48px)/3)] shrink-0 snap-start"
              >
                <TiltCard
                  className="h-[360px] flex flex-col justify-between bg-zinc-50 p-6 dark:bg-zinc-900/30 cursor-pointer group"
                >
                  {/* Clickable Card Area */}
                  <div className="flex-1 flex flex-col justify-between" onClick={() => {
                    setSelectedProject(project);
                    trackEvent("VIEW_PROJECT", project.id);
                  }}>
                    <div>
                      {/* Category */}
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 dark:text-blue-400">
                        {project.category}
                      </span>
                      
                      {/* Title */}
                      <h3 className="mt-2 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 transition-colors duration-200">
                        {project.title}
                      </h3>
                      
                      {/* Short Description */}
                      <p className="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-4">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-zinc-200/50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs text-zinc-400 dark:text-zinc-505 font-bold self-center">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Links prevent modal bubbling) */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-200/50 pt-4 dark:border-zinc-850">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        trackEvent("VIEW_PROJECT", project.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                    >
                      Project Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                      {project.demoLink && (
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-450 p-1"
                          title="Live Demo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-455 dark:hover:text-zinc-100 p-1"
                          title="Codebase Repository"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>

          <div className="mt-2 flex justify-between items-center px-2 text-xs font-bold text-zinc-400 dark:text-zinc-505">
            <span>Swipe or click arrows to explore</span>
            <span>Click cards for details</span>
          </div>
        </section>

        {/* EXPERIENCE SECTION - Vertical Timeline */}
        <section
          id="experience"
          ref={sectionsRef.experience}
          className="border-t border-zinc-200 py-16 dark:border-zinc-900 lg:py-24"
        >
          <div className="mb-16">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">
              Professional Journey
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-tight uppercase text-zinc-900 dark:text-zinc-50">
              Work Experience
            </h2>
          </div>

          <div className="relative border-l-2 border-zinc-200 pl-6 dark:border-zinc-900 sm:pl-8">
            {portfolioData.experience.map((exp) => (
              <div key={exp.id} className="relative mb-12 last:mb-0">
                {/* Timeline dot */}
                <span className="absolute -left-[31px] sm:-left-[39px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-blue-600 dark:border-zinc-950 dark:bg-blue-500" />

                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <div>
                    {/* Role / Job Title */}
                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {exp.role}
                    </h3>
                    {/* Company name */}
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {exp.company}
                    </p>
                  </div>
                  
                  {/* Meta Details */}
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs font-semibold text-zinc-400 dark:text-zinc-505">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {exp.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Achievements points */}
                <ul className="mt-4 list-none space-y-2.5">
                  {exp.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-zinc-650 dark:text-zinc-400">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-500/80 dark:text-blue-400/80" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION - Symmetrical Bento Grid Layout */}
        <section
          id="skills"
          ref={sectionsRef.skills}
          className="border-t border-zinc-200 py-16 dark:border-zinc-900 lg:py-24"
        >
          <div className="mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">
              Technical Stack
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-tight uppercase text-zinc-900 dark:text-zinc-50">
              Skills & Expertise
            </h2>
          </div>

          {/* Symmetrical grid mapping */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioData.skills.map((skillGroup, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-900 dark:bg-zinc-900/40"
              >
                <h3 className="mb-5 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500 border-b border-zinc-200/50 pb-2 dark:border-zinc-800">
                  {skillGroup.category}
                </h3>
                
                {/* Clean, Symmetrical internal grid */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-zinc-200/50 bg-white py-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-800 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-200 flex items-center justify-center min-h-[36px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolioData.achievements.map((ach) => (
              <div 
                key={ach.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
              >
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {ach.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-550 dark:text-zinc-400">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}

            {/* IELTS Score Card */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-950/20 dark:bg-blue-950/10 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-blue-900 dark:text-blue-400">
                  {portfolioData.scores.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-blue-800/80 dark:text-blue-400/80">
                  {portfolioData.scores.details}
                </p>
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-blue-600 dark:text-blue-500">
                  Band {portfolioData.scores.overall}
                </span>
                <span className="text-xs font-semibold text-blue-800/60 dark:text-blue-400/60">
                  / 9.0 (Academic)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION - High Contrast Form */}
        <section
          id="contact"
          ref={sectionsRef.contact}
          className="border-t border-zinc-200 py-16 dark:border-zinc-900 lg:py-24"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            
            {/* Info Side */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-500">
                Get in Touch
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-tight uppercase text-zinc-900 dark:text-zinc-50">
                Let's Build Something Together
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Whether you have an interesting job opportunity, want to talk about AI, or just want to connect, feel free to drop a message. You can also reach me directly at:
              </p>

              <div className="mt-8 space-y-4">
                <a 
                  href={`mailto:${portfolioData.email}`}
                  className="flex items-center gap-3 text-sm font-semibold text-zinc-650 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                >
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  {portfolioData.email}
                </a>
                <span className="flex items-center gap-3 text-sm font-semibold text-zinc-450 dark:text-zinc-550">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  {portfolioData.location}
                </span>
              </div>

              {/* Social Channels */}
              <div className="mt-10 flex gap-4">
                <a
                  href={portfolioData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-zinc-200 p-3 text-zinc-600 hover:border-blue-600 hover:text-blue-600 dark:border-zinc-900 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={portfolioData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-zinc-200 p-3 text-zinc-600 hover:border-blue-600 hover:text-blue-600 dark:border-zinc-900 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Form Side */}
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-900 dark:bg-zinc-900/20 sm:p-8">
              <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors duration-200 focus:border-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-blue-500"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs font-bold text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors duration-200 focus:border-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs font-bold text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors duration-200 focus:border-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-blue-500"
                    placeholder="Hi Sadnan, I'd love to connect..."
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs font-bold text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {formStatus.type && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                      formStatus.type === "success"
                        ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-450"
                        : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450"
                    }`}
                  >
                    {formStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-blue-600 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-blue-500 dark:hover:text-white"
                >
                  {isSubmitting ? (
                    <>
                      Sending...
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-10 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs font-semibold text-zinc-400 dark:text-zinc-505">
          <p>© {new Date().getFullYear()} Sadnan Nafis. All rights reserved.</p>
          <div className="flex gap-4">
            <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              GitHub
            </a>
            <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              LinkedIn
            </a>
            <a href={portfolioData.blog} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              Esports Writings
            </a>
          </div>
        </div>
      </footer>

      {/* Sliding Details Drawer Panel */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

    </div>
  );
}
