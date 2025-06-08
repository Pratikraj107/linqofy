"use client";

import { motion } from "framer-motion";
import { Search, Users, MessageCircle, Rocket, Layers, Award } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-8 w-8 text-white" />, bg: "bg-[#4f8cff]", badge: "bg-[#2176ff]", badgeNum: 1,
    title: "Searching",
    description: "Search for projects that match your skills and interests.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-white" />, bg: "bg-[#ff6f61]", badge: "bg-[#ff3b30]", badgeNum: 2,
    title: "Posting Projects",
    description: "Post projects that you need help with.",
  },
  {
    icon: <Users className="h-8 w-8 text-white" />, bg: "bg-[#34d399]", badge: "bg-[#10b981]", badgeNum: 3,
    title: "Finding Talent",
    description: "Find the best talent for your projects.",
  },
  {
    icon: <Award className="h-8 w-8 text-white" />, bg: "bg-[#b76cf4]", badge: "bg-[#a259f7]", badgeNum: 4,
    title: "Join Projects",
    description: "Join projects that you are interested in.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#f4f6fa]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            How linqofy Works
          </h2>
          <p className="text-gray-600 text-lg">
            From idea to reality, here's how our platform helps you build the perfect team and bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-10 shadow-md flex flex-col items-center text-center relative"
            >
              {/* Icon with badge */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow ${step.bg}`}>
                  {step.icon}
                </div>
                <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white ${step.badge}`}>{step.badgeNum}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0a1440] mb-2">{step.title}</h3>
              <p className="text-gray-500 text-base font-normal mb-0">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}