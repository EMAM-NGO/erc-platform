// Home.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Concept {
  title: string;
  description: string;
  article_url: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string,
  type: 'coding' | 'data';
}

const Home = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [concept, setConcept] = useState<Concept | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      // This function can stay as it is
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('fname')
            .eq('id', session.user.id)
            .single();
          if (userData) {
            setUserName(userData.fname);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchPageContent = async () => {
      try {
        const { data: conceptData, error: conceptError } = await supabase
          .from('concepts')
          .select('title, description, article_url')
          .eq('is_active', true)
          .single();

        if (conceptError) throw conceptError;
        setConcept(conceptData);

        // 1. UPDATE THE QUERY to fetch description
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select('id, title, description, type')
          .eq('is_active', true);

        if (challengesError) throw challengesError;
        setChallenges(challengesData || []);

      } catch (error) {
        console.error('Error fetching page content:', error);
      }
    };

    fetchUserData();
    fetchPageContent();
  }, []);

  const codingChallenge = challenges.find(c => c.type === 'coding');
  const dataChallenge = challenges.find(c => c.type === 'data');

  return (
    <>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-text-main-light dark:text-text-main-dark">
          Welcome Back, {userName || 'Guest'}!
        </h1>
        <p className="mt-2 text-lg text-text-muted-light dark:text-text-muted-dark">Ready for a new challenge?</p>
      </header>

      <div className="space-y-12">
        {/* Concept of the Week */}
        {concept ? (
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-8 border-l-4 border-primary">
                <div className="flex items-center mb-4">
                    <span className="text-primary font-bold mr-4">CONCEPT OF THE WEEK</span>
                    <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <h3 className="text-3xl font-bold mb-3 text-text-main-light dark:text-text-main-dark">{concept.title}</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-6 max-w-4xl">
                    {concept.description}
                </p>
                <a href={concept.article_url} target="_blank" rel="noopener noreferrer" className="inline-block font-bold text-primary hover:underline underline-offset-4">
                    Read the Article <i className="fas fa-arrow-right ml-2"></i>
                </a>
            </div>
        ) : (
          <p>Loading concept...</p>
        )}

        {/* Challenges Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coding Challenge Card */}
          {codingChallenge ? (
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6 transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-text-main-light dark:text-text-main-dark">
                <i className="fas fa-code text-primary mr-3"></i> {codingChallenge.title}
              </h3>
              {/* 2. UPDATE THE DISPLAY to use description */}
              <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
                {codingChallenge.description}
              </p>
              <Link to={`/challenge/${codingChallenge.id}`} className="font-medium text-primary hover:text-opacity-80">
                Start Challenge →
              </Link>
            </div>
          ) : <p>Loading challenge...</p>}

          {/* Data Challenge Card */}
          {dataChallenge ? (
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6 transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-bold mb-4 flex items-center text-text-main-light dark:text-text-main-dark">
                <i className="fas fa-chart-bar text-primary mr-3"></i> {dataChallenge.title}
              </h3>
               {/* 3. UPDATE THE DISPLAY to use description */}
              <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
                {dataChallenge.description}
              </p>
               {/* 4. FIX THE LINK to use React Router's Link component */}
              <Link
                to={`/challenge/${dataChallenge.id}`}
                className="font-medium text-primary hover:text-opacity-80"
              >
                Start Challenge →
              </Link>
            </div>
          ) : <p>Loading challenge...</p>}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/archive" className="font-bold text-primary hover:underline">
          View Content Archive
        </Link>
      </div>
    </>
  );
};

export default Home;