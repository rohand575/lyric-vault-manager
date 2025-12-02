import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Password {
  id: string;
  password_value: string;
}

const Passwords = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState<Password[]>([]);

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    const { data } = await supabase
      .from('viewer_passwords')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (data) {
      setPasswords(data);
    }
  };

  const deletePassword = async (id: string) => {
    const { error } = await supabase
      .from('viewer_passwords')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete password');
    } else {
      toast.success('Password deleted');
      fetchPasswords();
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Viewer Passwords</h2>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4">Password</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((pwd) => (
                <tr key={pwd.id} className="border-t border-border">
                  <td className="p-4">{pwd.password_value}</td>
                  <td className="p-4">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deletePassword(pwd.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/admin/analytics')}>See Analytics</Button>
          <Button onClick={() => navigate('/admin/about')}>Add About Text</Button>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Return to Admin Home Page
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Passwords;
