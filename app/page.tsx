import { HeroSection } from "@/components/hero-section";
import { FeaturedProjects } from "@/components/featured-projects";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { CTASection } from "@/components/cta-section";
import { ProjectFeed } from "@/components/project-feed";
import { TrendingProjects } from "@/components/trending-projects";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProjects />
      {/* <ProjectFeed />
      <TrendingProjects /> */}
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
}