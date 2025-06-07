"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Users, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Only show NavBar if user is not logged in
  if (user) return null;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have been signed out.",
      });
      
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-5 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            {/* <span className="font-playfair text-2xl font-bold gradient-text">
              Linqofy
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link font-medium text-gray-700 hover:text-olive-600"
              >
                {link.label}
              </Link>
            ))}
          </nav> */}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              {/* <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm w-44 transition-all duration-300 focus:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> */}
            </div>
            
            {user ? (
              <>
                <Button asChild variant="outline" className="font-medium">
                  <Link href="/projects/create">
                    <Layers className="mr-2 h-4 w-4" />
                    Create Project
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                      <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/projects">My Projects</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" className="bg-transparent font-medium text-white border-white hover:bg-white/10" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button
                  className="bg-[#b76cf4] text-white font-semibold shadow-lg border-none hover:brightness-110"
                  asChild
                >
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-800" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pt-5 pb-3 animate-fade-in">
            <div className="flex flex-col space-y-4 bg-white rounded-2xl shadow-lg p-6 mx-2 mt-4">
              {/* {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 font-medium text-gray-800 hover:text-olive-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))} */}
              <div className="relative mt-2">
                {/* <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm w-full"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /> */}
              </div>
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
                      <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/projects"
                    className="py-2 font-medium text-gray-800 hover:text-olive-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Projects
                  </Link>
                  <Link
                    href="/projects/create"
                    className="py-2 font-medium text-gray-800 hover:text-olive-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Project
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="py-2 font-medium text-gray-800 hover:text-olive-600 text-left"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3 pt-2">
                  <Button variant="outline" className="bg-[#b76cf4] text-white font-semibold shadow-lg border-none hover:brightness-110" asChild>
                    <Link href="/auth/sign-in">Sign In</Link>
                  </Button>
                  <Button
                    className="bg-[#b76cf4] text-white font-semibold shadow-lg border-none hover:brightness-110"
                    asChild
                  >
                    <Link href="/auth/sign-up">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}