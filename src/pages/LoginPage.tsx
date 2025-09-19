import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Make sure this path is correct

// Simple SVG icons for the buttons (retained from original file)
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 6.802C34.553 2.91 29.61 0 24 0C10.745 0 0 10.745 0 24s10.745 24 24 24s24-10.745 24-24c0-1.28-.112-2.522-.323-3.717l-.066-.4z"/>
    <path fill="#FF3D00" d="M6.306 14.691L14.631 21.23c1.743-4.82 6.207-8.491 11.621-8.491c3.059 0 5.842 1.154 7.961 3.039l7.027-7.027C34.553 2.91 29.61 0 24 0c-7.219 0-13.438 3.318-17.694 8.644z"/>
    <path fill="#4CAF50" d="M24 48c5.61 0 10.552-1.91 14.802-5.198l-7.027-7.027c-2.119 1.885-4.902 3.039-7.775 3.039c-5.414 0-9.878-3.67-11.621-8.491L6.306 33.309C10.562 42.682 16.781 48 24 48z"/>
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.457-2.295 4.488-4.298 5.823l7.027 7.027C42.062 36.318 48 29.932 48 24c0-1.28-.112-2.522-.323-3.717l-.066-.4z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.034c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.745.084-.729.084-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.304 3.492.997.108-.776.417-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- Handler for Email/Password Login with Role Check ---
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Step 1: Authenticate the user
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }
      
      // Step 2: Fetch user's role from the database
      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        // Step 3: Redirect based on the role
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Fallback to default dashboard if user object isn't returned
        navigate('/'); 
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Social Login Handler (Unchanged) ---
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
      // Note: Redirection for social logins will be handled by the onAuthStateChange
      // listener in your UserContext, which is a robust way to manage it.
    } catch (error) {
      console.error("Authentication error:", error);
      setError('Failed to sign in with social provider.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 transition-colors duration-500">
          Sign in to your account
        </h2>
        <div className="mt-8">
          <div className="bg-white dark:bg-emam-green/80 dark:backdrop-blur-sm py-8 px-4 shadow-xl ring-1 ring-gray-900/10 dark:ring-white/10 sm:rounded-lg sm:px-10 transition-colors duration-500">
            <form className="space-y-6" onSubmit={handleEmailLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emam-green focus:outline-none focus:ring-emam-green sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emam-green focus:outline-none focus:ring-emam-green sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-center text-red-500 dark:text-red-400">{error}</p>}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-emam-green py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-emam-green focus:ring-offset-2 dark:bg-emam-accent dark:text-emam-green dark:font-bold dark:focus:ring-offset-gray-800 disabled:opacity-50"
                >
                  {isLoading ? 'Signing In...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-emam-green/80 px-2 text-gray-500 dark:text-gray-300">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button onClick={() => handleSocialLogin('google')} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <GoogleIcon /> Google
                  </button>
                </div>
                <div>
                  <button onClick={() => handleSocialLogin('github')} className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <GitHubIcon /> GitHub
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm">
              <a href="#" className="font-medium text-emam-green hover:text-opacity-80 dark:text-emam-accent">
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
