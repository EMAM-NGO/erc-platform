// src/components/AdminRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const AdminRoute = () => {
  const { user, isLoading } = useUser();

  // 1. While the user's data is loading, show a loading message.
  //    This prevents a flicker or incorrect redirect before we know the user's role.
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a spinner component
  }

  // 2. If the user is loaded and their role is 'admin', allow access.
  //    The <Outlet /> component renders the actual admin page requested (e.g., ManageWorkshops).
  if (user?.role === 'admin') {
    return <Outlet />;
  }

  // 3. If the user is not an admin, or not logged in, redirect them.
  //    They will be sent to the main user dashboard.
  return <Navigate to="/" replace />;
};

export default AdminRoute;