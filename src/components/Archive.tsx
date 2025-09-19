// src/components/Archive.tsx

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// You can reuse these types from your Home component
interface Concept {
  title: string;
  description: string;
  article_url: string;
  created_at: string;
}

interface Challenge {
  title: string;
  description: string;
  type: 'coding' | 'data';
  created_at: string;
}

const Archive = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        setLoading(true);

        // Fetch all concepts that are NOT active, ordered by newest first
        const { data: conceptData, error: conceptError } = await supabase
          .from('concepts')
          .select('title, description, article_url, created_at')
          .eq('is_active', false)
          .order('created_at', { ascending: false });

        if (conceptError) throw conceptError;
        setConcepts(conceptData || []);

        // Fetch all challenges that are NOT active, ordered by newest first
        const { data: challengeData, error: challengeError } = await supabase
          .from('challenges')
          .select('title, description, type, created_at')
          .eq('is_active', false)
          .order('created_at', { ascending: false });

        if (challengeError) throw challengeError;
        setChallenges(challengeData || []);

      } catch (error) {
        console.error('Error fetching archive data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, []);

  if (loading) {
    return <p>Loading archive...</p>;
  }

  return (
    <>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text-main-light dark:text-text-main-dark">
          Content Archive
        </h1>
        <p className="mt-2 text-lg text-text-muted-light dark:text-text-muted-dark">
          Browse all past concepts and challenges.
        </p>
      </header>

      {/* Past Concepts Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-text-main-light dark:text-text-main-dark">Past Concepts</h2>
        <div className="space-y-6">
          {concepts.length > 0 ? concepts.map((concept) => (
            <div key={concept.title} className="bg-card-light dark:bg-card-dark rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2 text-text-main-light dark:text-text-main-dark">{concept.title}</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark mb-4">{concept.description}</p>
              <a href={concept.article_url} className="font-medium text-primary hover:text-opacity-80">
                Read Article →
              </a>
            </div>
          )) : <p className="text-text-muted-light dark:text-text-muted-dark">No archived concepts yet.</p>}
        </div>
      </section>

      {/* Past Challenges Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-text-main-light dark:text-text-main-dark">Past Challenges</h2>
        <div className="space-y-6">
          {challenges.length > 0 ? challenges.map((challenge) => (
            <div key={challenge.title} className="bg-card-light dark:bg-card-dark rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-2 text-text-main-light dark:text-text-main-dark">{challenge.title}</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark">{challenge.description}</p>
            </div>
          )) : <p className="text-text-muted-light dark:text-text-muted-dark">No archived challenges yet.</p>}
        </div>
      </section>
    </>
  );
};

export default Archive;