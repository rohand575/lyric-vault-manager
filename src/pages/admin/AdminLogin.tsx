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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Administrator Login</h1>
          <p className="text-muted-foreground">
            To reach administrator page enter password & press Enter
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
          />
          <Button 
            type="submit" 
            className="w-full h-12 text-lg"
            disabled={loading}
          >
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
