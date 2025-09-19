import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import LoginLayout from './components/LoginLayout';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';

// Protector Component
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import WorkshopDetails from './pages/WorkshopDetails';
import LoginPage from './pages/LoginPage';
import ExamResults from './pages/ExamResults';
import RecordedSessions from './pages/RecordedSessions';
import CodingChallenge from './pages/CodingChallenges';
import References from './pages/References';
import Archive from './components/Archive';

// Admin Pages
import ManageWorkshops from './pages/admin/ManageWorkshops';
import ManageUsers from './pages/admin/ManageUsers';
import ManageContent from './pages/admin/ManageContent';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route uses LoginLayout */}
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* User Dashboard Routes use DashboardLayout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="workshops" element={<Dashboard />} />
          <Route path="sessions" element={<RecordedSessions />} />
          <Route path="results" element={<ExamResults />} />
          <Route path="workshops/:workshopId" element={<WorkshopDetails />} />
          <Route path="challenge/:challengeId" element={<CodingChallenge />} />          
          <Route path="references" element={<References />} />
          <Route path="archive" element={<Archive />} />
        </Route>

        {/* Protected Admin Routes use AdminLayout */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ManageWorkshops />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="content" element={<ManageContent />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;