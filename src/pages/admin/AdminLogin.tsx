import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { setAdminSession } from '@/lib/auth';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await supabase
        .from('settings')
        .select('admin_password_hash')
        .single();

      if (data && data.admin_password_hash === password) {
        setAdminSession(true);
        navigate('/admin');
      } else {
        toast.error('Invalid admin password');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-border/50 p-10 space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Administrator
            </h1>
            <p className="text-muted-foreground text-lg">
              To reach administrator page enter password & press Enter
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 text-base bg-background/50 border-2"
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full shadow-lg" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Entering...' : 'Enter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
