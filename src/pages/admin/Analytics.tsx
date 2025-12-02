import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface AnalyticsData {
  password: string;
  dates: string[];
  songs: string[];
}

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const { data: passwords } = await supabase
      .from('viewer_passwords')
      .select('id, password_value');

    if (!passwords) return;

    const analyticsData: AnalyticsData[] = [];

    for (const pwd of passwords) {
      const { data: sessions } = await supabase
        .from('viewer_sessions')
        .select('id, login_at')
        .eq('viewer_password_id', pwd.id);

      const dates = sessions?.map(s => format(new Date(s.login_at), 'yyyy-MM-dd')) || [];
      const uniqueDates = [...new Set(dates)];

      const sessionIds = sessions?.map(s => s.id) || [];
      const { data: clicks } = await supabase
        .from('song_clicks')
        .select('song_id, songs(title)')
        .in('viewer_session_id', sessionIds);

      const songs = clicks?.map((c: any) => c.songs?.title).filter(Boolean) || [];
      const uniqueSongs = [...new Set(songs)];

      analyticsData.push({
        password: pwd.password_value,
        dates: uniqueDates,
        songs: uniqueSongs
      });
    }

    setAnalytics(analyticsData);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Analytics</h2>
        
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4">Password</th>
                <th className="text-left p-4">Dates Accessed</th>
                <th className="text-left p-4">Song Titles Clicked On</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((item, idx) => (
                <tr key={idx} className="border-t border-border">
                  <td className="p-4">{item.password}</td>
                  <td className="p-4">
                    {item.dates.length > 0 ? item.dates.join(', ') : 'None'}
                  </td>
                  <td className="p-4">
                    {item.songs.length > 0 ? item.songs.join(', ') : 'None'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/passwords')}>
            Return to Admin Password Page
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Return to Admin Home Page
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
