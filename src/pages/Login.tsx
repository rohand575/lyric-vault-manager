import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { setViewerSession } from '@/lib/auth';
import { toast } from 'sonner';

const Login = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: passwords } = await supabase
        .from('viewer_passwords')
        .select('*')
        .eq('password_value', password);

      if (!passwords || passwords.length === 0) {
        toast.error('Invalid password');
        setLoading(false);
        return;
      }

      const passwordRecord = passwords[0];
      
      const { data: session, error } = await supabase
        .from('viewer_sessions')
        .insert({ viewer_password_id: passwordRecord.id })
        .select()
        .single();

      if (error) throw error;

      setViewerSession(session.id, passwordRecord.id);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Welcome</h1>
          <p className="text-muted-foreground">
            To enter site please enter your password & press Enter
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
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
        <div className="mt-6 text-center">
          <a 
            href="/admin/login" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Administrator Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
