"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Users, Heart, BookmarkPlus, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@supabase/auth-helpers-react";
import { SignInModal } from "@/components/sign-in-modal";

const PRIMARY_BLUE = "#000b76";

// Example project data
const FEATURED_PROJECTS = [
  {
    id: "1",
    title: "AI-Powered Content Creator Platform",
    description: "Looking for a team to build a platform that uses AI to help creators generate and optimize content for different platforms.",
    category: "AI & Machine Learning",
    postedBy: {
      name: "Alex Morgan",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Product Manager",
    },
    skills: ["React", "Node.js", "Machine Learning", "UI/UX Design"],
    engagement: {
      comments: 12,
      interested: 8,
      likes: 24,
    },
    timeAgo: "2 days ago",
  },
  {
    id: "2",
    title: "Eco-Friendly Shopping Mobile App",
    description: "Seeking developers and designers to create a mobile app that helps users find eco-friendly products and track their environmental impact.",
    category: "Mobile Apps",
    postedBy: {
      name: "Jamie Chen",
      avatar: "https://i.pravatar.cc/150?img=2",
      role: "Entrepreneur",
    },
    skills: ["React Native", "Firebase", "UI/UX Design", "Sustainability"],
    engagement: {
      comments: 8,
      interested: 15,
      likes: 31,
    },
    timeAgo: "5 days ago",
  },
  {
    id: "3",
    title: "Blockchain-Based Voting System",
    description: "Looking to build a secure, transparent voting system using blockchain technology. Need experts in blockchain, security, and frontend development.",
    category: "Blockchain",
    postedBy: {
      name: "Chris Taylor",
      avatar: "https://i.pravatar.cc/150?img=3",
      role: "CTO",
    },
    skills: ["Solidity", "Ethereum", "React", "Cybersecurity"],
    engagement: {
      comments: 19,
      interested: 12,
      likes: 42,
    },
    timeAgo: "1 week ago",
  },
];

export function FeaturedProjects() {
  const session = useSession();
  const isSignedIn = !!session;
  // If not signed in, show only featured projects
  // If signed in, fetch and show all projects (implement fetching as needed)
  const projectsToShow = FEATURED_PROJECTS; // For now, just show featured

  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
              Featured Projects
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Discover exciting projects looking for talented collaborators. Connect with project owners and bring these ideas to life.
            </p>
          </div>
          <Link href={isSignedIn ? "/discover" : "#"} onClick={e => { if (!isSignedIn) { e.preventDefault(); setShowSignIn(true); } }} className="mt-4 md:mt-0 group flex items-center text-olive-600 hover:text-olive-700 font-medium">
            View all projects
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsToShow.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="bg-[#000b76]/10 text-[#000b76] border-0">
                    {project.category}
                  </Badge>
                  <span className="text-gray-500 text-sm">{project.timeAgo}</span>
                </div>

                <Link href={`/projects/${project.id}`}>
                  <h3 className="text-xl font-semibold mb-2 hover:text-[#000b76] transition-colors">
                    {project.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center mb-5">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={project.postedBy.avatar} />
                    <AvatarFallback>{project.postedBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{project.postedBy.name}</p>
                    <p className="text-xs text-gray-500">{project.postedBy.role}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <button className="text-[#000b76] hover:text-[#000b76]/80 transition-colors flex items-center text-sm">
                      <MessageCircle className="h-4 w-4 mr-1 text-[#000b76]" />
                      {project.engagement.comments}
                    </button>
                    <button className="text-[#000b76] hover:text-[#000b76]/80 transition-colors flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1 text-[#000b76]" />
                      {project.engagement.interested}
                    </button>
                    <button className="text-[#000b76] hover:text-[#000b76]/80 transition-colors flex items-center text-sm">
                      <Heart className="h-4 w-4 mr-1 text-[#000b76]" />
                      {project.engagement.likes}
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-[#000b76] hover:text-[#000b76]/80 transition-colors">
                      <BookmarkPlus className="h-5 w-5 text-[#000b76]" />
                    </button>
                    <button className="text-[#000b76] hover:text-[#000b76]/80 transition-colors">
                      <Share2 className="h-5 w-5 text-[#000b76]" />
                    </button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: hoveredProject === project.id ? 1 : 0,
                    y: hoveredProject === project.id ? 0 : 10
                  }}
                  transition={{ duration: 0.2 }}
                  className="mt-5"
                >
                  <Button 
                    onClick={() => { if (!isSignedIn) setShowSignIn(true); else {/* handle interest */} }}
                    className="w-full bg-[#000b76] text-white font-semibold shadow-lg border-none hover:bg-[#000b76]/90"
                  >
                    I'm Interested
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </section>
  );
}