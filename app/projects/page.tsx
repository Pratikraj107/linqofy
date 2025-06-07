"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import Link from "next/link";

// Example user's projects data (in a real app, this would come from an API)
const USER_PROJECTS = [
  {
    id: "1",
    title: "AI-Powered Content Creator Platform",
    description: "Looking for a team to build a platform that uses AI to help creators generate and optimize content for different platforms.",
    category: "AI & Machine Learning",
    postedBy: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "Product Manager",
    },
    skills: ["React", "Node.js", "Machine Learning", "UI/UX Design"],
    engagement: {
      comments: 12,
      interested: 8,
      likes: 24,
    },
    timeAgo: "2 days ago",
    status: "Active",
  },
  {
    id: "2",
    title: "Eco-Friendly Shopping Mobile App",
    description: "Seeking developers and designers to create a mobile app that helps users find eco-friendly products and track their environmental impact.",
    category: "Mobile Apps",
    postedBy: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "Entrepreneur",
    },
    skills: ["React Native", "Firebase", "UI/UX Design", "Sustainability"],
    engagement: {
      comments: 8,
      interested: 15,
      likes: 31,
    },
    timeAgo: "5 days ago",
    status: "Draft",
  },
];

export default function MyProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = USER_PROJECTS.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Projects</h1>
              <p className="text-gray-600">Manage and track your project listings</p>
            </div>
            <Button asChild className="mt-4 md:mt-0 btn-primary">
              <Link href="/projects/create">
                <Plus className="h-5 w-5 mr-2" />
                Create New Project
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search your projects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === "Active" ? "bg-green-100 text-green-800" :
                        project.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <ProjectCard project={project} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Filter className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any projects matching your criteria.
              </p>
              <Button asChild variant="outline">
                <Link href="/projects/create">Create Your First Project</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}