import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminSession } from '@/lib/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = getAdminSession();
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm bg-secondary/30 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Administration Panel
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
};
