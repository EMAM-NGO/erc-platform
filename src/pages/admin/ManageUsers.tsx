import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Modal from '../../components/Modal';
import Notification from '../../components/Notification';

interface User {
  id: string;
  fname: string;
  lname: string;
  role: string;
  email?: string; // From auth.users
}

const InviteUserForm: React.FC<{
  onClose: () => void;
  showNotification: (msg: string, type: 'success' | 'error') => void;
}> = ({ onClose, showNotification }) => {
  const [email, setEmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send invite via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email);
      if (authError) throw authError;

      // Insert user metadata into public.users
      const roleToInsert = isAdmin ? 'admin' : 'user'; // Determine the role string
      const { error: insertError } = await supabase.from('users').insert([
        { id: authData.user?.id, fname, lname, role: roleToInsert },
      ]);
      if (insertError) throw insertError;

      showNotification('User invited successfully!', 'success');
      onClose();
    } catch (error) {
      showNotification('Failed to invite user.', 'error');
      console.error('Supabase error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="fname" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">
          First Name
        </label>
        <input
          type="text"
          id="fname"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
          required
        />
      </div>
      <div>
        <label htmlFor="lname" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">
          Last Name
        </label>
        <input
          type="text"
          id="lname"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mr-2 rounded border-gray-300 dark:border-gray-600 focus:ring-primary"
          />
          <span className="text-sm font-medium text-text-muted-light dark:text-gray-300">Admin Role</span>
        </label>
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Invite'}
        </button>
      </div>
    </form>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from public.users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, fname, lname, role');
        if (userError) throw userError;

        // Fetch emails from auth.users
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) throw authError;

        // Combine user data with emails
        const usersWithEmail = userData.map((user: User) => {
          const authUser = authData.users.find((authUser: any) => authUser.id === user.id);
          return { ...user, email: authUser?.email || 'Pending' };
        });

        setUsers(usersWithEmail as User[]);
      } catch (error) {
        setNotification({ message: 'Failed to fetch users.', type: 'error' });
        console.error('Supabase error:', error);
      }
    };

    fetchUsers();

    const subscription = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchUsers())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleRoleChange = async (user: User, newRole: string) => {
      // Convert the display value (e.g., "Admin") to the database value (e.g., "admin")
      const roleToUpdate = newRole === 'Admin' ? 'admin' : 'user';
      try {
        const { error } = await supabase
          .from('users')
          .update({ role: roleToUpdate })
          .eq('id', user.id);
        if (error) throw error;
        setNotification({ message: `Role updated for ${user.fname} ${user.lname}.`, type: 'success' });
      } catch (error) {
        setNotification({ message: 'Failed to update role.', type: 'error' });
        console.error('Supabase error:', error);
      }
    };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        // Delete from public.users
        const { error: userError } = await supabase.from('users').delete().eq('id', userToDelete.id);
        if (userError) throw userError;

        // Delete from auth.users
        const { error: authError } = await supabase.auth.admin.deleteUser(userToDelete.id);
        if (authError) throw authError;

        setNotification({ message: `User ${userToDelete.fname} ${userToDelete.lname} deleted successfully!`, type: 'success' });
      } catch (error) {
        setNotification({ message: 'Failed to delete user.', type: 'error' });
        console.error('Supabase error:', error);
      }
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-text-main-light dark:text-white">Manage Users</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Invite New User
        </button>
      </header>

      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-4 text-text-main-light dark:text-white">Name</th>
              <th className="p-4 text-text-main-light dark:text-white">Email</th>
              <th className="p-4 text-text-main-light dark:text-white">Role</th>
              <th className="p-4 text-text-main-light dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b dark:border-gray-700">
                <td className="p-4 font-medium text-text-main-light dark:text-white">{`${user.fname} ${user.lname}`}</td>
                <td className="p-4 text-text-muted-light dark:text-gray-300">{user.email || 'Pending'}</td>
                <td className="p-4">
                  <select
                      value={user.role === 'admin' ? 'Admin' : 'Trainee'} // <-- Correctly display the current role
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className="bg-gray-100 dark:bg-gray-800 rounded p-1 text-text-main-light dark:text-white border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary"
                  >
                    <option>Trainee</option>
                    <option>Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-500 hover:underline dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite New User">
        <InviteUserForm onClose={() => setIsModalOpen(false)} showNotification={showNotification} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="text-text-main-light dark:text-white">
          <p>
            Are you sure you want to remove the user "{userToDelete?.fname} {userToDelete?.lname}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-opacity-90 dark:hover:bg-gray-500 text-text-main-light dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="py-2 px-4 rounded-lg bg-red-500 text-white font-bold hover:bg-opacity-90"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
};

export default ManageUsers;