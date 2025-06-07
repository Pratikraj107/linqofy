"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_CATEGORIES, TEAM_ROLES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { createProject } from '@/lib/project-utils';

const PRIMARY_BLUE = "#000b76";

export default function CreateProjectPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [compensation, setCompensation] = useState("");
  const [compensationDetails, setCompensationDetails] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("You must be signed in to create a project.");

      const project = {
        title,
        description: shortDescription + "\n\n" + longDescription,
        category,
        skills: selectedSkills,
        duration,
        team_size: teamSize,
        compensation,
        compensation_details: compensationDetails,
        created_by: user.id,
      };
      const result = await createProject(project);
      toast({
        title: "Success!",
        description: "Your project has been created.",
      });
      // Reset form
      setTitle("");
      setCategory("");
      setShortDescription("");
      setLongDescription("");
      setSelectedSkills([]);
      setDuration("");
      setTeamSize("");
      setCompensation("");
      setCompensationDetails("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      
      if (value && !selectedSkills.includes(value)) {
        setSelectedSkills([...selectedSkills, value]);
        input.value = "";
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/discover"
            className="inline-flex items-center text-gray-600 hover:text-[#000b76] mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Discover
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY_BLUE} 0%, ${PRIMARY_BLUE} 100%)` }} />
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create a New Project</h1>
                <p className="text-gray-600">Share your vision and find the perfect team to bring it to life</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a clear, descriptive title"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Project Category</Label>
                  <Select required value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    placeholder="Write a brief summary of your project (max 200 characters)"
                    maxLength={200}
                    required
                    value={shortDescription}
                    onChange={e => setShortDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Detailed Description</Label>
                  <Textarea
                    id="longDescription"
                    placeholder="Provide a detailed description of your project, including goals, features, and technical requirements"
                    className="h-40"
                    required
                    value={longDescription}
                    onChange={e => setLongDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills</Label>
                  <Input
                    id="skills"
                    placeholder="Type a skill and press Enter or comma to add"
                    onKeyDown={handleSkillInput}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => removeSkill(skill)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration</Label>
                    <Select required value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 months</SelectItem>
                        <SelectItem value="3-6">3-6 months</SelectItem>
                        <SelectItem value="6-12">6-12 months</SelectItem>
                        <SelectItem value="12+">12+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Team Size Needed</Label>
                    <Select required value={teamSize} onValueChange={setTeamSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 people</SelectItem>
                        <SelectItem value="3-5">3-5 people</SelectItem>
                        <SelectItem value="6-10">6-10 people</SelectItem>
                        <SelectItem value="10+">10+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compensation">Compensation Type</Label>
                  <Select required value={compensation} onValueChange={setCompensation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select compensation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="revenue">Revenue Share</SelectItem>
                      <SelectItem value="both">Equity + Revenue Share</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compensationDetails">Compensation Details</Label>
                  <Textarea
                    id="compensationDetails"
                    placeholder="Provide details about the compensation structure"
                    required
                    value={compensationDetails}
                    onChange={e => setCompensationDetails(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#000b76] text-white font-semibold hover:bg-[#000b76]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating project..." : "Create Project"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}