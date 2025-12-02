import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getViewerSession } from '@/lib/auth';

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const navigate = useNavigate();
  const [siteName, setSiteName] = useState('');

  useEffect(() => {
    const session = getViewerSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const fetchSettings = async () => {
      const { data } = await supabase
        .from('settings')
        .select('site_name')
        .single();
      if (data) {
        setSiteName(data.site_name);
      }
    };

    fetchSettings();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {siteName}
            </h1>
            <nav className="flex gap-8">
              <a href="/" className="text-foreground/70 hover:text-primary transition-all duration-300 font-medium">
                Home
              </a>
              <a href="/about" className="text-foreground/70 hover:text-primary transition-all duration-300 font-medium">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
};
