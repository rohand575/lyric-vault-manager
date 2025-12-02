import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const About = () => {
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
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

    fetchSettings();
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">ABOUT</h2>
        <div className="whitespace-pre-wrap text-lg mb-8 leading-relaxed">
          {aboutText}
        </div>
        {contactEmail && (
          <p className="text-lg mb-8">
            Please email Barry Faber at{' '}
            <a 
              href={`mailto:${contactEmail}`}
              className="text-primary hover:underline"
            >
              {contactEmail}
            </a>
          </p>
        )}
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

export default About;
