import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      // Redirect the user to the login page after a successful logout
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return { handleLogout };
};