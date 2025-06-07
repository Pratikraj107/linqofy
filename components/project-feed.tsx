import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  createdAt: string;
  author: {
    name: string;
    avatar: string;
  };
}

export function ProjectFeed() {
  // TODO: Replace with actual data fetching from Supabase
  const projects: Project[] = [
    {
      id: "1",
      title: "AI-Powered Task Manager",
      description: "Building a smart task manager that uses AI to prioritize and organize tasks.",
      skills: ["React", "TypeScript", "AI/ML", "Node.js"],
      createdAt: "2024-03-20",
      author: {
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
      },
    },
    // Add more sample projects here
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={project.author.avatar}
                    alt={project.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-600">{project.author.name}</span>
                </div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Button className="w-full">Show Interest</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 