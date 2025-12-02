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
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ABOUT
        </h2>
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl border-2 border-border/50 p-8 md:p-12 mb-8 shadow-lg">
          <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/90 mb-6">
            {aboutText}
          </div>
          {contactEmail && (
            <p className="text-lg pt-6 border-t border-border/50">
              Please email Barry Faber at{' '}
              <a 
                href={`mailto:${contactEmail}`}
                className="text-primary hover:text-accent transition-colors duration-300 font-medium underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>
            </p>
          )}
        </div>
        <Button 
          onClick={() => navigate('/')}
          size="lg"
          className="w-full sm:w-auto shadow-lg"
        >
          Return to Home Page
        </Button>
      </div>
    </PublicLayout>
  );
};

export default About;
