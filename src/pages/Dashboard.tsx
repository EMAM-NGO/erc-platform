import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import WorkshopCard from '../components/WorkshopCard';

// Define a type for our workshop data
interface Workshop {
  id: string;
  title: string;
  date: string;
  hosts: string;
  description: string;
}

const Dashboard = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  // --- Refactored useEffect Hook for Supabase ---
  useEffect(() => {
    // 2. Create an async function to fetch the initial data.
    const fetchWorkshops = async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('date', { ascending: false }); // Optional: order workshops by date

      if (error) {
        console.error("Error fetching workshops:", error);
      } else if (data) {
        setWorkshops(data as Workshop[]);
      }
    };

    // Fetch the data on initial component mount
    fetchWorkshops();

    const channel = supabase
      .channel('public:workshops')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workshops' },
        (payload) => {
          console.log('Change received!', payload);
          // When a change is detected, re-fetch the workshops list
          fetchWorkshops();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Workshops</h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Browse and review materials from past hands-on workshop events.
          </p>
        </header>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {workshops.map(ws => (
          <WorkshopCard
            key={ws.id}
            id={ws.id}
            title={ws.title}
            date={ws.date}
            description={ws.description}
            hosts={ws.hosts}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;