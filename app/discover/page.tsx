"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_CATEGORIES, TEAM_ROLES } from "@/lib/constants";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from '@/lib/supabase';

const PRIMARY_BLUE = "#000b76";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*, profiles(full_name, avatar_url, role)')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Filter projects based on search query and selected filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.skills || []).some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    const matchesRole = !selectedRole || (project.skills || []).some((skill: string) => skill.toLowerCase().includes(selectedRole.toLowerCase()));

    return matchesSearch && matchesCategory && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="font-playfair text-4xl font-bold mb-4" style={{ color: PRIMARY_BLUE }}>Discover Projects</h1>
          <p className="text-gray-600 text-lg">
            Find exciting projects that match your skills and interests.
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#000b76]" />
              <Input
                type="text"
                placeholder="Search by title, description, or skills..."
                className="pl-10 border-[1.5px] border-[#000b76] focus:ring-[#000b76]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="md:w-auto border-[#000b76] text-[#000b76] hover:bg-[#000b76]/10"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2 text-[#000b76]" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            >
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-[#000b76] focus:ring-[#000b76]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {PROJECT_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.label} className="text-[#000b76]">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="border-[#000b76] focus:ring-[#000b76]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  {TEAM_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.label} className="text-[#000b76]">
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </div>

        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-lg text-gray-500">Loading projects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={{
                  ...project,
                  postedBy: project.profiles ? {
                    name: project.profiles.full_name || "Anonymous",
                    avatar: project.profiles.avatar_url || "https://i.pravatar.cc/150",
                    role: project.profiles.role || "Member",
                  } : {
                    name: "Anonymous",
                    avatar: "https://i.pravatar.cc/150",
                    role: "Member",
                  },
                  engagement: {
                    comments: 0, // You can fetch actual counts if needed
                    interested: 0,
                    likes: 0,
                  },
                  skills: project.skills || [],
                  timeAgo: "", // You can format created_at if needed
                }} />
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No projects found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}