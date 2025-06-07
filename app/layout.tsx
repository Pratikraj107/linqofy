'use client';
import './globals.css';
import { inter, playfair } from '@/lib/fonts';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { NavBar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { SideNav } from '@/components/sidenav';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const [sideNavOpen, setSideNavOpen] = useState(true);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // Optionally redirect to home or login
  };

  // Only show SideNav if user is logged in and not on /auth/* routes
  const showSideNav = user && !pathname.startsWith('/auth');

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light">
          <NavBar />
          <div className="flex flex-grow">
            {showSideNav && (
              <SideNav
                activeTab={pathname}
                onLogout={handleLogout}
                open={sideNavOpen}
                setOpen={setSideNavOpen}
              />
            )}
            <main className={`flex-grow ${(showSideNav && sideNavOpen) ? 'ml-60' : ''}`}>{children}</main>
          </div>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}