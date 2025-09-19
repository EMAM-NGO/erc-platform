// pages/ExamResults.tsx

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// 1. Define a type for our combined exam and grade data
interface ExamResult {
  score: number;
  paper_url: string | null;
  feedback: string | null;
  exams: {
    name: string;
    max_score: number;
    exam_date: string | null;
  }[] | null;
}

const ExamResults = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 2. Fetch data from the 'grades' table and JOIN the related 'exams' data
        const { data, error } = await supabase
          .from('grades')
          .select(`
            score,
            paper_url,
            feedback,
            exams (
              name,
              max_score,
              exam_date
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setResults(data as ExamResult[]);
        }
      } catch (err: any) {
        setError('Could not fetch exam results.');
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (isLoading) {
    return <p className="text-center p-8">Loading your results...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center p-8">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">Exam Results</h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          Review your performance and marks from past examinations.
        </p>
      </header>
      
      {/* 3. Render the results in a table */}
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg overflow-hidden">
        {results.length === 0 ? (
          <p className="p-8 text-center text-text-muted-light dark:text-text-muted-dark">
            You have not completed any exams yet.
          </p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exam Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {results.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{result.exams?.[0]?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{result.score} / {result.exams?.[0]?.max_score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {result.exams?.[0]?.exam_date ? new Date(result.exams[0].exam_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {result.paper_url && (
                      <a href={result.paper_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View Paper
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExamResults;