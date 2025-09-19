// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import your custom hook

const ProtectedRoute = () => {
  // Use your custom hook to get the user and loading status
  const { user, isLoading } = useUser();

  // 1. While the context is checking for a session, show a loading indicator.
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Loading session...</p>
        </div>
    );
  }

  // 2. If loading is finished and there is no user, redirect to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If loading is finished and a user exists, show the protected content.
  return <Outlet />;
};

export default ProtectedRoute;