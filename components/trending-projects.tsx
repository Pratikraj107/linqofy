import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrendingProject {
  id: string;
  title: string;
  description: string;
  interestCount: number;
  skills: string[];
  author: {
    name: string;
    avatar: string;
  };
}

export function TrendingProjects() {
  // TODO: Replace with actual data fetching from Supabase
  const trendingProjects: TrendingProject[] = [
    {
      id: "1",
      title: "Web3 Social Platform",
      description: "Building a decentralized social media platform using blockchain technology.",
      skills: ["Solidity", "React", "Web3.js", "Node.js"],
      interestCount: 42,
      author: {
        name: "Jane Smith",
        avatar: "https://github.com/shadcn.png",
      },
    },
    // Add more sample projects here
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Trending Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProjects.map((project) => (
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
                      className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {project.interestCount} people interested
                  </span>
                  <Button>Join Project</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 