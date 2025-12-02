import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AboutEditor = () => {
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('settings')
      .select('about_text, contact_email')
      .single();
    
    if (data) {
      setAboutText(data.about_text || '');
      setContactEmail(data.contact_email || '');
    }
  };

  const makeActive = async () => {
    const { data: settings } = await supabase
      .from('settings')
      .select('id')
      .single();

    if (!settings) return;

    const { error } = await supabase
      .from('settings')
      .update({ about_text: aboutText, contact_email: contactEmail })
      .eq('id', settings.id);
    
    if (error) {
      toast.error('Failed to save');
    } else {
      toast.success('About text and email saved');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Edit About Page</h2>
        
        <div>
          <Label htmlFor="about">About Text</Label>
          <Textarea
            id="about"
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Enter about text..."
            className="min-h-[300px]"
          />
        </div>

        <div>
          <Label htmlFor="email">Contact Email</Label>
          <Input
            id="email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={makeActive}>Make Active</Button>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Return to Admin Home Page
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AboutEditor;
