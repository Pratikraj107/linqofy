"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Camera, Briefcase, MapPin, Globe, Link as LinkIcon } from "lucide-react";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    title: "",
    bio: "",
    location: "",
    website: "",
    avatar_url: "",
    skills: [] as string[],
    github_url: "",
    linkedin_url: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth/sign-in");
        return;
      }
      setUser(user);
      fetchProfile(user.id);
    };

    getUser();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile({
        ...profile,
        ...data,
        skills: data.skills || [],
      });
    }
  };

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      
      if (value && !profile.skills.includes(value)) {
        setProfile({
          ...profile,
          skills: [...profile.skills, value],
        });
        input.value = "";
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          updated_at: new Date().toISOString(),
          ...profile,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="h-2 w-full gradient-bg" />
            
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-olive-500/20 to-peach-500/20" />
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                    <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Camera className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 pt-20">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                <p className="text-gray-600">Update your personal information and profile settings</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="title"
                      className="pl-10"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="location"
                      className="pl-10"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="website"
                      type="url"
                      className="pl-10"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    className="h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    placeholder="Type a skill and press Enter or comma to add"
                    onKeyDown={handleSkillInput}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skills.map((skill) => (
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

                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="LinkedIn URL"
                        className="pl-10"
                        value={profile.linkedin_url}
                        onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="GitHub URL"
                        className="pl-10"
                        value={profile.github_url}
                        onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving changes..." : "Save Changes"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}