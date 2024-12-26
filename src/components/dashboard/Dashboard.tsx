import { useState, useEffect } from 'react';
import { Upload, FileText, Download, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ResumeList } from './ResumeList';
import { FileUpload } from './FileUpload';

export function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        // .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Resumes</h1>
      </div>

      <FileUpload onUploadComplete={fetchResumes} />

      <ResumeList resumes={resumes} isLoading={isLoading} onDelete={fetchResumes} />
    </div>
  );
}