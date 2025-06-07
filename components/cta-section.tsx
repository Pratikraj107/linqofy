"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000b76]/95 to-[#3a4ad9]/95 -z-10" />
      
      {/* Decorative patterns */}
      {/* Optionally, update or remove decorative patterns for a cleaner blue look */}

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-10">
            Whether you have a project idea or want to join one, TeamForge connects you with passionate people ready to collaborate and create.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[#000b76] text-white font-bold text-lg px-8 py-6 shadow-lg hover:bg-[#1a23b9] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.18), 0 1px 0 #000' }}
              size="lg"
            >
              <Link href="/post-project">
                Post Your Project
                <ArrowRight className="ml-2 h-5 w-5 text-white" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-base px-8 py-6"
              size="lg"
            >
              <Link href="/discover">
                Find Projects
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}