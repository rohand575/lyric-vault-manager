import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Song {
  id: string;
  title: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [siteName, setSiteName] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchSongs();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('settings')
      .select('site_name')
      .single();
    if (data) {
      setSiteName(data.site_name);
    }
  };

  const fetchSongs = async () => {
    const { data } = await supabase
      .from('songs')
      .select('id, title')
      .order('created_at', { ascending: true })
      .limit(50);
    if (data) {
      setSongs(data);
    }
  };

  const saveSiteName = async () => {
    const { error } = await supabase
      .from('settings')
      .update({ site_name: siteName })
      .eq('id', (await supabase.from('settings').select('id').single()).data?.id);
    
    if (error) {
      toast.error('Failed to save site name');
    } else {
      toast.success('Site name saved');
    }
  };

  const addPassword = async () => {
    if (!newPassword.trim()) {
      toast.error('Please enter a password');
      return;
    }

    const { data: existing } = await supabase
      .from('viewer_passwords')
      .select('id')
      .limit(50);

    if (existing && existing.length >= 50) {
      toast.error('Maximum 50 passwords reached');
      return;
    }

    const { error } = await supabase
      .from('viewer_passwords')
      .insert({ password_value: newPassword });
    
    if (error) {
      toast.error('Failed to add password');
    } else {
      toast.success('Password added');
      setNewPassword('');
    }
  };

  const editLyrics = async (songId?: string, title?: string) => {
    if (!songId && title) {
      const { data } = await supabase
        .from('songs')
        .insert({ title, lyrics: '', is_active: false })
        .select()
        .single();
      
      if (data) {
        navigate(`/admin/songs/${data.id}`);
      }
    } else if (songId) {
      navigate(`/admin/songs/${songId}`);
    }
  };

  const handleNewSong = (index: number) => {
    const title = (document.getElementById(`song-${index}`) as HTMLInputElement)?.value;
    if (title?.trim()) {
      editLyrics(undefined, title);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Website Name</h2>
          <div className="space-y-4">
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter website name"
            />
            <Button onClick={saveSiteName}>Save</Button>
          </div>
        </section>

        <section className="border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Song Titles (up to 50)</h2>
          <div className="space-y-2">
            {Array.from({ length: 50 }).map((_, i) => {
              const song = songs[i];
              return (
                <div key={i} className="flex gap-2">
                  <Input
                    id={`song-${i}`}
                    defaultValue={song?.title || ''}
                    placeholder={`Song ${i + 1}`}
                  />
                  <Button 
                    onClick={() => song ? editLyrics(song.id) : handleNewSong(i)}
                  >
                    Edit Lyrics
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add Viewer Password</h2>
          <div className="flex gap-2">
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
            />
            <Button onClick={addPassword}>Add</Button>
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/admin/passwords')}
          >
            See Passwords
          </Button>
        </section>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/admin/passwords')}>Passwords</Button>
          <Button onClick={() => navigate('/admin/analytics')}>Analytics</Button>
          <Button onClick={() => navigate('/admin/about')}>About Text</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
