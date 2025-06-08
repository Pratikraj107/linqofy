"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Users, Heart, BookmarkPlus, Share2, ArrowLeft, Calendar, Clock, Send } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// In a real app, this would be fetched from an API
const ALL_PROJECTS = [
  {
    id: "1",
    title: "AI-Powered Content Creator Platform",
    description: "Looking for a team to build a platform that uses AI to help creators generate and optimize content for different platforms.",
    longDescription: `We're seeking talented individuals to join us in building an innovative AI-powered content creation platform. Our vision is to revolutionize how creators work by providing intelligent tools that streamline the content creation process.

Key Features:
- AI-powered content suggestions and optimization
- Multi-platform content adaptation
- Analytics and performance tracking
- Collaboration tools for teams
- Content scheduling and automation

Technical Requirements:
- Experience with modern web technologies (React, Node.js)
- Understanding of machine learning concepts
- Knowledge of content management systems
- Experience with API integration
- Strong UI/UX design skills

We're looking for team members who are passionate about AI and content creation, with a strong desire to build something that will make a real impact in the creator economy.`,
    category: "AI & Machine Learning",
    postedBy: {
      name: "Alex Morgan",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Product Manager",
      location: "San Francisco, CA",
      timezone: "PST",
    },
    skills: ["React", "Node.js", "Machine Learning", "UI/UX Design"],
    engagement: {
      comments: 12,
      interested: 8,
      likes: 24,
    },
    timeAgo: "2 days ago",
    timeline: {
      posted: "2024-03-15",
      estimatedDuration: "4-6 months",
      startDate: "Immediate",
    },
    teamSize: {
      current: 2,
      needed: 4,
    },
    compensation: {
      type: "Equity + Revenue Share",
      details: "15-20% equity split among team members",
    },
  },
  // ... other projects
];

interface Comment {
  id: string;
  user_id: string;
  project_id: string;
  content: string;
  created_at: string;
  profiles?: {
    email?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

const PRIMARY_BLUE = "#000b76";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const { toast } = useToast();
  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalLinkedIn, setProposalLinkedIn] = useState("");
  const [proposalRole, setProposalRole] = useState("");
  const [proposalSuccess, setProposalSuccess] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    const fetchProject = async () => {
      setLoadingProject(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*, profiles(full_name, avatar_url, role)')
        .eq('id', params.id)
        .single();
      if (!error && data) {
        setProject(data);
      } else {
        setProject(null);
      }
      setLoadingProject(false);
    };
    getUser();
    fetchProject();
    fetchComments();
  }, [params.id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles!user_id(full_name, avatar_url)
      `)
      .eq('project_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    setComments(data || []);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }
    if (!newComment.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          project_id: params.id,
          content: newComment.trim(),
          user_id: user.id,
        });
      if (error) throw error;
      setNewComment("");
      await fetchComments();
      toast({
        title: "Success",
        description: "Comment posted successfully",
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

  // Proposal submission handler
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to send a proposal",
        variant: "destructive",
      });
      return;
    }
    try {
      const { error } = await supabase
        .from('proposals')
        .insert({
          project_id: project.id,
          sender_id: user.id,
          message: proposalMessage,
          linkedin: proposalLinkedIn,
          expected_role: proposalRole,
        });
      if (error) throw error;
      setProposalSuccess(true);
      setTimeout(() => {
        setShowProposalDialog(false);
        setProposalSuccess(false);
        setProposalMessage("");
        setProposalLinkedIn("");
        setProposalRole("");
      }, 1500);
      toast({
        title: "Success",
        description: "Proposal sent successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Recommended RLS policy for Supabase:
  // create policy "Users can delete their own comments" on comments for delete using (auth.uid() = user_id);

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (!error) {
      await fetchComments();
      toast({
        title: "Deleted",
        description: "Comment deleted successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loadingProject) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-500">Loading project...</div>;
  }
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/discover"
            className="inline-flex items-center text-gray-600 hover:text-[#000b76] mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Discover
          </Link>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${PRIMARY_BLUE} 0%, ${PRIMARY_BLUE} 100%)` }} />
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="outline" className="bg-gradient-to-r from-olive-500/10 to-peach-500/10 text-gray-700 border-0">
                  {project.category}
                </Badge>
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-[#000b76] transition-colors">
                    <BookmarkPlus className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-[#000b76] transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>

              <div className="flex items-center mb-6">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={project.profiles?.avatar_url || 'https://i.pravatar.cc/150'} />
                  <AvatarFallback>{(project.profiles?.full_name || 'A')[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">{project.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{project.profiles?.role || 'Member'}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Posted {project.timeAgo}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="whitespace-pre-wrap text-gray-600">
                  {project.longDescription}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Project Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Duration: {project.timeline?.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Start: {project.timeline?.startDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Team</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">
                        Current: {project.teamSize?.current} / Looking for: {project.teamSize?.needed}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">{project.compensation?.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills && project.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-4">
                  <button className="text-gray-500 hover:text-[#000b76] transition-colors flex items-center">
                    <MessageCircle className="h-5 w-5 mr-1" />
                    <span>{comments?.length}</span>
                  </button>
                  <button className="text-gray-500 hover:text-[#000b76] transition-colors flex items-center">
                    <Users className="h-5 w-5 mr-1" />
                    <span>{project.engagement?.interested}</span>
                  </button>
                  <button className="text-gray-500 hover:text-[#000b76] transition-colors flex items-center">
                    <Heart className="h-5 w-5 mr-1" />
                    <span>{project.engagement?.likes}</span>
                  </button>
                </div>
                <Button size="lg" className="bg-[#000b76] text-white font-semibold hover:bg-[#000b76]/90" onClick={() => setShowProposalDialog(true)}>
                  Send Proposal
                </Button>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6">Comments</h3>
                
                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} />
                      <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder={user ? "Write a comment..." : "Please sign in to comment"}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!user}
                        className="mb-2 border-2 border-[#000b76] focus:border-[#000b76] focus:ring-[#000b76]"
                      />
                      <Button 
                        type="submit"
                        disabled={!user || isLoading || !newComment.trim()}
                        className="flex items-center bg-[#000b76] text-white font-semibold hover:bg-[#000b76]/90"
                      >
                        <Send className="h-4 w-4 mr-2 text-white" />
                        {isLoading ? "Posting..." : "Post Comment"}
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=anon`} />
                        <AvatarFallback>{(comment.profiles?.full_name?.[0] || 'A').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{comment.profiles?.full_name || 'Anonymous'}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment?.created_at).toLocaleDateString()}
                            </span>
                            {user && comment.user_id === user.id && (
                              <button
                                className="text-red-500 text-xs ml-2 hover:underline"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-gray-700">{comment?.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Dialog */}
      <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Proposal</DialogTitle>
          </DialogHeader>
          {proposalSuccess ? (
            <div className="text-green-600 text-center py-8 font-semibold">Proposal sent successfully!</div>
          ) : (
            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <Textarea
                  required
                  value={proposalMessage}
                  onChange={e => setProposalMessage(e.target.value)}
                  placeholder="Write your proposal message..."
                  className="resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn (optional)</label>
                <Input
                  value={proposalLinkedIn}
                  onChange={e => setProposalLinkedIn(e.target.value)}
                  placeholder="Your LinkedIn profile URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Role (optional)</label>
                <Input
                  value={proposalRole}
                  onChange={e => setProposalRole(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-[#000b76] text-white font-semibold hover:bg-[#000b76]/90">Send Proposal</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}