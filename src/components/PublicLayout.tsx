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
      <header className="border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{siteName}</h1>
            <nav className="flex gap-6">
              <a href="/" className="hover:text-primary transition-colors">
                Home
              </a>
              <a href="/about" className="hover:text-primary transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
