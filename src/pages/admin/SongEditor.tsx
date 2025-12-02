import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SongEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');

  useEffect(() => {
    if (id) {
      fetchSong();
    }
  }, [id]);

  const fetchSong = async () => {
    const { data } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      setTitle(data.title);
      setLyrics(data.lyrics || '');
    }
  };

  const saveAndMakeActive = async () => {
    const { error } = await supabase
      .from('songs')
      .update({ title, lyrics, is_active: true })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to save');
    } else {
      toast.success('Song saved and activated');
      navigate('/admin');
    }
  };

  const save = async () => {
    const { error } = await supabase
      .from('songs')
      .update({ title, lyrics })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to save');
    } else {
      toast.success('Song saved');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Label htmlFor="title">Song Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter song title"
          />
        </div>
        
        <div>
          <Label htmlFor="lyrics">Add/Edit Lyrics</Label>
          <Textarea
            id="lyrics"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Enter lyrics here..."
            className="min-h-[400px]"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={saveAndMakeActive}>Save & Make Active</Button>
          <Button variant="outline" onClick={save}>Save</Button>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Return to Admin Home Page
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SongEditor;
