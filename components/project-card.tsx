import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Users, Heart, BookmarkPlus, Share2 } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    postedBy: {
      name: string;
      avatar: string;
      role: string;
    };
    skills: string[];
    engagement: {
      comments: number;
      interested: number;
      likes: number;
    };
    timeAgo: string;
  };
}

const PRIMARY_BLUE = "#000b76";

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} passHref legacyBehavior>
      <a
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 flex flex-col justify-between min-h-[420px] transition-shadow hover:shadow-lg focus:shadow-lg cursor-pointer outline-none focus:ring-2 focus:ring-[#000b76]"
        tabIndex={0}
        role="link"
      >
        <div>
          <div className="flex justify-between items-start mb-3">
            <Badge className="bg-[#000b76]/10 text-[#000b76] font-medium px-3 py-1 rounded-full text-xs border-0">{project.category}</Badge>
            <span className="text-gray-400 text-xs font-medium">{project.timeAgo}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 hover:text-[#000b76] transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map((skill) => (
              <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <img src={project.postedBy.avatar} alt={project.postedBy.name} className="h-8 w-8 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-gray-900 leading-tight text-sm">{project.postedBy.name}</div>
              <div className="text-xs text-gray-500">{project.postedBy.role}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[#000b76] mt-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><MessageCircle className="h-5 w-5" />{project.engagement.comments}</span>
            <span className="flex items-center gap-1"><Users className="h-5 w-5" />{project.engagement.interested}</span>
            <span className="flex items-center gap-1"><Heart className="h-5 w-5" />{project.engagement.likes}</span>
          </div>
          <div className="flex items-center gap-4">
            <BookmarkPlus className="h-5 w-5 cursor-pointer" />
            <Share2 className="h-5 w-5 cursor-pointer" />
          </div>
        </div>
      </a>
    </Link>
  );
}