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
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif mb-8 text-center">
          Click any of the following song titles to see full lyrics
        </h2>
        <div className="space-y-3">
          {songs.length === 0 ? (
            <p className="text-muted-foreground text-center">No songs available yet.</p>
          ) : (
            songs.map((song, index) => (
              <a
                key={song.id}
                href={`/songs/${song.id}`}
                className="block p-6 rounded-xl border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-lg font-medium group-hover:text-primary transition-colors duration-300">
                  {song.title}
                </span>
              </a>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Home;
