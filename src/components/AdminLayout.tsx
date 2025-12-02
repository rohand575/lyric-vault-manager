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
      <header className="border-b border-border py-4 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Administration Panel</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
