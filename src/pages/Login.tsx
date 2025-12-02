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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-border/50 p-10 space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-muted-foreground text-lg">
              To enter site please enter your password & press Enter
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Enter your password"
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
          
          <div className="text-center pt-4 border-t border-border/50">
            <a 
              href="/admin/login" 
              className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 font-medium"
            >
              Administrator Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
