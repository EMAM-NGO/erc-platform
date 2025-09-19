// pages/RecordedSessions.tsx

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface RecordedSession {
  id: string;
  title: string;
  description: string | null;
  youtube_video_id: string;
}

const RecordedSessions = () => {
  const [sessions, setSessions] = useState<RecordedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('recorded_sessions')
          .select('id, title, description, youtube_video_id')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSessions(data || []);
      } catch (err: any) {
        setError('Could not fetch recorded sessions.');
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (isLoading) {
    return <p className="text-center p-8">Loading sessions...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center p-8">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Recorded Sessions</h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          Browse our library of pre-recorded online sessions and tutorials.
        </p>
      </header>
      
      {sessions.length === 0 ? (
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-8 text-center">
            <p className="text-text-muted-light dark:text-text-muted-dark">No recorded sessions are available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session) => (
            <div key={session.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  src={`https://www.youtube.com/embed/${session.youtube_video_id}`}
                  title={session.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{session.title}</h3>
                {session.description && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{session.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordedSessions;