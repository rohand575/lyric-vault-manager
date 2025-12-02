import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { getViewerSession } from '@/lib/auth';

interface Song {
  id: string;
  title: string;
  lyrics: string;
}

const SongLyrics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const fetchSongAndLog = async () => {
      if (!id) return;

      const { data } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (data) {
        setSong(data);

        const session = getViewerSession();
        if (session) {
          await supabase
            .from('song_clicks')
            .insert({
              viewer_session_id: session.sessionId,
              song_id: id
            });
        }
      }
    };

    fetchSongAndLog();
  }, [id]);

  if (!song) {
    return (
      <PublicLayout>
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">{song.title}</h2>
        <div className="whitespace-pre-wrap text-lg mb-8 leading-relaxed">
          {song.lyrics || 'No lyrics available.'}
        </div>
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="w-full sm:w-auto"
        >
          Return to Home Page
        </Button>
      </div>
    </PublicLayout>
  );
};

export default SongLyrics;
