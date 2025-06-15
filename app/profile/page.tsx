"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Mail, Calendar, Edit2, X } from "lucide-react";
import Link from "next/link";

const TABS = [
  { label: "My Projects", key: "my-projects" },
  { label: "Collaborating", key: "collaborating" },
  { label: "Completed", key: "completed" },
];

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("collaborating");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProfile, setEditProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [collabProjects, setCollabProjects] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const getUserAndData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth/sign-in");
        return;
      }
      setUser(user);
      fetchProfile(user.id);
      fetchMyProjects(user.id);
      fetchCollaboratingProjects(user.id);
    };
    getUserAndData();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data);
  };

  const fetchMyProjects = async (userId: string) => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });
    setMyProjects(data || []);
  };

  const fetchCollaboratingProjects = async (userId: string) => {
    // Get proposals sent by user
    const { data: proposals } = await supabase
      .from("proposals")
      .select("project_id")
      .eq("sender_id", userId);
    const projectIds = proposals?.map((p: any) => p.project_id) || [];
    if (projectIds.length === 0) {
      setCollabProjects([]);
      return;
    }
    // Get project details
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .in("id", projectIds)
      .order("created_at", { ascending: false });
    setCollabProjects(projects || []);
  };

  const openEditModal = () => {
    setEditProfile({ ...profile });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditProfile(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editProfile.full_name,
          bio: editProfile.bio,
          location: editProfile.location,
        })
        .eq("id", user.id);
      if (error) throw error;
      setProfile({ ...profile, ...editProfile });
      toast({ title: "Profile updated!" });
      closeEditModal();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left: Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/3 max-w-sm bg-white rounded-2xl shadow-lg p-6 relative"
        >
          {/* Edit button */}
          <button
            className="absolute top-6 right-6 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 transition"
            title="Edit Profile"
            onClick={openEditModal}
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.full_name}</h2>
            <div className="text-blue-700 font-medium mb-2">@{user.user_metadata?.username || user.email.split("@")[0]}</div>
            <p className="text-gray-700 text-center mb-4">{profile.bio || "No bio provided."}</p>
            <div className="flex flex-col gap-2 text-gray-600 text-sm w-full mb-4">
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user.created_at).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-6 mb-6 mt-2">
              <a href={profile.github_url || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
              </a>
              <a href={profile.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect width="4" height="12" x="2" y="9" rx="2"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href={profile.twitter_url || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.67 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.7 2.16 2.94 4.07 2.97A9.05 9.05 0 010 21.54a12.8 12.8 0 006.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z"/></svg>
              </a>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              <div className="bg-gray-50 rounded-xl py-4 flex flex-col items-center shadow-sm">
                <span className="text-blue-700 text-2xl font-bold">12</span>
                <span className="text-gray-500 text-sm mt-1">Projects Posted</span>
              </div>
              <div className="bg-gray-50 rounded-xl py-4 flex flex-col items-center shadow-sm">
                <span className="text-green-600 text-2xl font-bold">8</span>
                <span className="text-gray-500 text-sm mt-1">Active Collabs</span>
              </div>
              <div className="bg-gray-50 rounded-xl py-4 flex flex-col items-center shadow-sm">
                <span className="text-purple-600 text-2xl font-bold">15</span>
                <span className="text-gray-500 text-sm mt-1">Completed</span>
              </div>
              <div className="bg-gray-50 rounded-xl py-4 flex flex-col items-center shadow-sm">
                <span className="text-yellow-500 text-2xl font-bold flex items-center">4.9 <svg className="ml-1" width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg></span>
                <span className="text-gray-500 text-sm mt-1">Rating</span>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative animate-fade-in">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  onClick={closeEditModal}
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-bold mb-6 text-center">Edit Profile</h2>
                <form onSubmit={handleEditSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="full_name">Full Name</label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      className="input-field"
                      value={editProfile.full_name}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      className="input-field h-24"
                      value={editProfile.bio}
                      onChange={handleEditChange}
                      maxLength={200}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="location">Location</label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className="input-field"
                      value={editProfile.location}
                      onChange={handleEditChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-primary mt-4"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right: Projects & Tabs */}
        <div className="flex-1 w-full">
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`text-lg font-medium pb-2 px-1 border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-700 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label} <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 text-xs">{tab.key === 'my-projects' ? myProjects.length : tab.key === 'collaborating' ? collabProjects.length : 1}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "my-projects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {myProjects.length === 0 ? (
                <div className="text-gray-400 text-center col-span-2 py-12">No projects posted yet.</div>
              ) : myProjects.map(project => (
                <div key={project.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="relative">
                    <img
                      src={
                        Array.isArray(project.image_url) && project.image_url.length > 0
                          ? project.image_url[0]
                          : "/placeholder.png"
                      }
                      alt={project.title}
                      className="w-full h-40 object-cover"
                    />
                    {project.status && (
                      <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{project.status}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(project.tags || project.skills || []).map((tag: string) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>👥 {project.team_size || 1}/4</span>
                      <Link href={`/projects/${project.id}`} className="text-blue-700 hover:underline flex items-center gap-1">
                        View <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M5 12l5-5-5-5"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "collaborating" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {collabProjects.length === 0 ? (
                <div className="text-gray-400 text-center col-span-2 py-12">No collaborations yet.</div>
              ) : collabProjects.map(project => (
                <div key={project.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="relative">
                    <img
                      src={
                        Array.isArray(project.image_url) && project.image_url.length > 0
                          ? project.image_url[0]
                          : "/placeholder.png"
                      }
                      alt={project.title}
                      className="w-full h-40 object-cover"
                    />
                    {project.status && (
                      <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{project.status}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                    <p className="text-gray-600 mb-3 text-sm">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(project.tags || project.skills || []).map((tag: string) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>👥 {project.team_size || 1}/4</span>
                      <Link href={`/projects/${project.id}`} className="text-blue-700 hover:underline flex items-center gap-1">
                        View <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M5 12l5-5-5-5"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Add similar sections for Completed as needed */}
        </div>
      </div>
    </div>
  );
}