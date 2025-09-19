// pages/References.tsx

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Make sure this path is correct

// 1. Define a TypeScript interface for a single resource
interface Resource {
  id: string;
  category: string;
  title: string;
  author: string;
  image_url: string;
  tags: string[];
  annotation: string;
  url: string;
  action_text: string;
}

// The hardcoded 'resources' array is now removed.

// Define the order of categories explicitly
const categories = ['Books', 'Courses', 'Articles', 'Papers', 'Sheets'];

const References = () => {
  // 2. Add state for resources, loading, and errors
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Fetch resources from the database when the component mounts
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResources(data || []);
      } catch (err: any) {
        setError('Could not fetch resources.');
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (isLoading) {
    return <p className="text-center p-8">Loading resources...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center p-8">{error}</p>;
  }

  return (
    <>
      <header className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Curated Resources
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          Welcome to our library of essential resources. These are the books, articles, and papers we believe are invaluable for any serious practitioner.
        </p>
      </header>

      <div className="space-y-16">
        {categories.map((category) => {
          // The rest of the rendering logic remains the same,
          // it now just uses the 'resources' from our state
          const categoryResources = resources.filter(r => r.category === category);

          if (categoryResources.length === 0) {
            return null; 
          }

          return (
            <section key={category}>
              <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200 dark:border-gray-700 text-text-main-light dark:text-text-main-dark">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {categoryResources.map((resource) => (
                    <div 
                      key={resource.id} 
                      className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6 flex flex-col transform hover:-translate-y-1 transition-transform duration-300"
                    >
                      <img 
                        src={resource.image_url} 
                        alt={`Cover of ${resource.title}`} 
                        className="w-full h-48 object-contain rounded-md mb-4" 
                      />
                      <div className="flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-text-main-light dark:text-text-main-dark">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                          {resource.author}
                        </p>
                        <p className="flex-grow mt-3 text-base text-text-muted-light dark:text-text-muted-dark">
                          {resource.annotation}
                        </p>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="mt-4 font-bold text-primary hover:underline underline-offset-4 self-start"
                        >
                          {resource.action_text} <i className="fas fa-external-link-alt ml-1 text-xs"></i>
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  );
};

export default References;