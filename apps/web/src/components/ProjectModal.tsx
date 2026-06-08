"use client";

import React, { useEffect, useState } from "react";
import { Project } from "@/data/portfolio";
import { X, Github, ExternalLink, Cpu, Code2, Hammer, Database, Layout, Server, CircuitBoard } from "lucide-react";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setIsOpen(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
      document.body.style.overflow = "";
    }
  }, [project]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project]);

  if (!project) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI & ML":
        return <Cpu className="h-5 w-5 text-blue-500" />;
      case "Full Stack":
        return <Code2 className="h-5 w-5 text-blue-500" />;
      default:
        return <Hammer className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-zinc-950/45 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Sliding Side Drawer Panel */}
      <div
        className={`relative z-10 flex h-full w-full max-w-xl flex-col border-l border-zinc-200 bg-white p-6 shadow-2xl transition-transform duration-300 ease-out dark:border-zinc-900 dark:bg-zinc-950 sm:p-8 md:p-10 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header Drawer Control */}
        <div className="flex items-center justify-between mb-6">
          <span className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-400">
            {getCategoryIcon(project.category)}
            {project.category}
          </span>

          <button
            onClick={handleClose}
            className="rounded-xl border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
          {/* Title */}
          <h3 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {project.title}
          </h3>

          <div className="my-5 border-t border-zinc-150 dark:border-zinc-900" />

          {/* Description */}
          <div className="mb-6">
            <h4 className="mb-2 text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Project Case Study
            </h4>
            <p className="text-sm leading-relaxed text-zinc-650 dark:text-zinc-400 whitespace-pre-line">
              {project.fullDescription}
            </p>
          </div>

          {project.architecture && (
            <>
              <div className="my-5 border-t border-zinc-150 dark:border-zinc-900" />

              {/* Advanced Technical Stack Mapped directly from GitHub specs */}
              <div className="mb-6">
                <h4 className="mb-4 text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  System Architecture Details
                </h4>
                
                <div className="space-y-4">
                  {project.architecture.frontend && (
                    <div className="flex items-start gap-3">
                      <Layout className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-500" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 block">Frontend UI</span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{project.architecture.frontend.join(", ")}</p>
                      </div>
                    </div>
                  )}

                  {project.architecture.backend && (
                    <div className="flex items-start gap-3">
                      <Server className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-500" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 block">Backend Server</span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{project.architecture.backend.join(", ")}</p>
                      </div>
                    </div>
                  )}

                  {project.architecture.database && (
                    <div className="flex items-start gap-3">
                      <Database className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-500" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 block">Data Tier</span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{project.architecture.database.join(", ")}</p>
                      </div>
                    </div>
                  )}

                  {project.architecture.ai_ml && (
                    <div className="flex items-start gap-3">
                      <Cpu className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-500" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 block">AI & ML Pipelines</span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{project.architecture.ai_ml.join(", ")}</p>
                      </div>
                    </div>
                  )}

                  {project.architecture.hardware && (
                    <div className="flex items-start gap-3">
                      <CircuitBoard className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-500" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550 block">Hardware & Embedded</span>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">{project.architecture.hardware.join(", ")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="my-5 border-t border-zinc-150 dark:border-zinc-900" />

          {/* Core Tags */}
          <div className="mb-6">
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Stack Summary
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-zinc-200/50 bg-zinc-50 px-2.5 py-1 text-xs font-bold text-zinc-800 dark:border-zinc-900 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 border-t border-zinc-150 pt-6 dark:border-zinc-900">
          <div className="flex gap-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-blue-600 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                <Github className="h-4 w-4" />
                Repository
              </a>
            )}

            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-zinc-850 transition-all duration-200 hover:border-blue-600 hover:text-blue-600 dark:border-zinc-850 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
