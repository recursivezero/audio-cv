import { FileText, Download, Play, Pause, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Resume {
  id: string;
  title: string;
  audio_url: string | null;
  transcript: string | null;
  created_at: string;
}

interface ResumeListProps {
  resumes: Resume[];
  isLoading: boolean;
  onDelete: () => void;
}

export function ResumeList({ resumes, isLoading, onDelete }: ResumeListProps) {
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resume')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Resume deleted successfully');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No resumes uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="bg-card p-4 rounded-lg shadow-sm border flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-medium">{resume.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(resume.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {resume.audio_url ? (
              <>
                <Button variant="outline" size="icon">
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button disabled>Processing...</Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="text-destructive"
              onClick={() => handleDelete(resume.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}