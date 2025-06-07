"use client";

import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative pt-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #000b76 0%, #3a4ad9 100%)" }}>
      {/* Content */}
      <div className="container mx-auto px-4 pt-10 pb-32 md:pt-20 md:pb-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              <span className="gradient-text text-white">Find Your Dream Team.</span>
              <br />
              <span className="text-white">Build</span>
              <br />
              <span className="text-white">What Matters.</span>
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8">
              Whether you're an entrepreneur, developer, designer, or just someone with vision — find the right teammates to bring your project to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                className="bg-[#000b76] text-white font-semibold text-base px-8 py-6 border-none shadow-lg hover:bg-[#000b76]/90"
                size="lg"
              >
                Post Your Project
                <ArrowRight className="ml-2 h-5 w-5 text-white" />
              </Button>
              <Button
                variant="outline"
                className="bg-transparent text-white border-white text-base px-8 py-6 hover:bg-white/10"
                size="lg"
              >
                Browse Projects
              </Button>
            </div>

            <div className="mt-12 hidden md:block">
              <p className="text-white mb-3">Popular categories:</p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {["Web Development", "Mobile Apps", "UI/UX Design", "Data Science", "Marketing"].map((category) => (
                  <Link
                    key={category}
                    href={`/discover?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-4 py-2 bg-white/20 rounded-full text-sm text-white border border-white/30 hover:border-white hover:bg-white/30 transition-colors shadow-sm"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Find the perfect team</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I'm looking for</label>
                  <select className="input-field">
                    <option>All roles</option>
                    <option>Developers</option>
                    <option>Designers</option>
                    <option>Product Managers</option>
                    <option>Marketers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project category</label>
                  <select className="input-field">
                    <option>All categories</option>
                    <option>Web Development</option>
                    <option>Mobile Apps</option>
                    <option>UI/UX Design</option>
                    <option>Data Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. React, Python, Figma..."
                      className="input-field pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <Button
                  className="w-full bg-[#000b76] text-white font-semibold py-6 border-none shadow-lg hover:bg-[#000b76]/90"
                >
                  Search Projects
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Wavy white SVG at the bottom */}
      <div className="absolute left-0 bottom-0 w-full pointer-events-none" style={{ lineHeight: 0 }}>
        <svg
          viewBox="0 0 1920 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[120px] md:h-[200px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 Q480,180 960,120 T1920,160 L1920,200 L0,200 Z"
            fill="#fff"
          />
        </svg>
      </div>
    </div>
  );
}