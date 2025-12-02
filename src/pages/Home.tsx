import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { supabase } from '@/integrations/supabase/client';

interface Song {
  id: string;
  title: string;
}

const Home = () => {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await supabase
        .from('songs')
        .select('id, title')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (data) {
        setSongs(data);
      }
    };

    fetchSongs();
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl mb-6">
          Click any of the following song titles to see full lyrics
        </h2>
        <div className="space-y-2">
          {songs.length === 0 ? (
            <p className="text-muted-foreground">No songs available yet.</p>
          ) : (
            songs.map((song) => (
              <a
                key={song.id}
                href={`/songs/${song.id}`}
                className="block p-4 rounded-lg border border-border hover:bg-secondary hover:border-primary transition-colors"
              >
                {song.title}
              </a>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Home;
