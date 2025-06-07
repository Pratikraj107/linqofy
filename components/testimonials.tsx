"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    content: "TeamForge helped me find the perfect developers and designers for my startup. We've successfully launched our MVP and secured our first round of funding!",
    author: {
      name: "Sarah Johnson",
      role: "Founder, EcoTrack",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  },
  {
    id: 2,
    content: "As a freelance developer, I've found amazing projects and collaborators through TeamForge. The platform made it easy to showcase my skills and connect with innovative teams.",
    author: {
      name: "Michael Chen",
      role: "Full-Stack Developer",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  },
  {
    id: 3,
    content: "I had a game idea but needed help bringing it to life. Through TeamForge, I connected with talented developers and artists who shared my vision. Our game just hit 100K downloads!",
    author: {
      name: "Emma Rodriguez",
      role: "Game Designer",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 text-lg">
            Hear from people who have found their dream teams and brought amazing projects to life.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 md:p-12 shadow-lg"
            >
              <div className="absolute -top-6 left-10 text-olive-500/20">
                <Quote className="h-24 w-24" strokeWidth={1} />
              </div>
              <div className="relative z-10">
                <p className="text-gray-700 text-lg md:text-xl mb-8 italic">
                  "{testimonials[currentIndex].content}"
                </p>
                <div className="flex items-center">
                  <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                    <AvatarImage src={testimonials[currentIndex].author.avatar} />
                    <AvatarFallback>{testimonials[currentIndex].author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">{testimonials[currentIndex].author.name}</h4>
                    <p className="text-gray-500">{testimonials[currentIndex].author.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8">
            <button
              onClick={handlePrevious}
              className="h-10 w-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:text-olive-600 transition-colors mr-3"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === index
                      ? "w-8 bg-gradient-to-r from-olive-500 to-peach-500"
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:text-olive-600 transition-colors ml-3"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}