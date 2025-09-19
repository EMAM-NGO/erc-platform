import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Modal from '../../components/Modal';
import Notification from '../../components/Notification';

interface Workshop {
  id: number;
  title: string;
  date: string;
  hosts: string;
  description: string;
  materials: string[];
  prerequisites: string[];
}

interface Session {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface Challenge {
  id: number;
  title: string;
  type: 'coding' | 'data';
  description: string;
}

const WorkshopForm: React.FC<{
  onClose: () => void;
  showNotification: (msg: string, type: 'success' | 'error') => void;
  workshop?: Workshop | null;
}> = ({ onClose, showNotification, workshop }) => {
  const [title, setTitle] = useState(workshop?.title || '');
  const [date, setDate] = useState(workshop?.date || '');
  const [hosts, setHosts] = useState(workshop?.hosts || '');
  const [description, setDescription] = useState(workshop?.description || '');
  const [materials, setMaterials] = useState<string[]>(workshop?.materials || []);
  const [prerequisites, setPrerequisites] = useState(workshop?.prerequisites?.join(', ') || '');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
      const sanitizedFileName = fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const uniquePath = `public/${sanitizedFileName}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(uniquePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      setMaterials(prev => [...prev, uniquePath]);
      showNotification('File uploaded successfully. Save the workshop to confirm.', 'success');
    } catch (error) {
      console.error(error);
      showNotification('File upload failed!', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
      showNotification('Please wait for the file to finish uploading.', 'error');
      return;
    }
    const prereqList = prerequisites.split(',').map(p => p.trim()).filter(Boolean);
    const workshopData = { title, date, hosts, description, materials, prerequisites: prereqList };

    try {
      if (workshop) {
        const { error } = await supabase.from('workshops').update(workshopData).eq('id', workshop.id);
        if (error) throw error;
        showNotification('Workshop updated successfully!', 'success');
      } else {
        const { error } = await supabase.from('workshops').insert([workshopData]);
        if (error) throw error;
        showNotification('Workshop added successfully!', 'success');
      }
      onClose();
    } catch (error) {
      showNotification('Failed to save workshop.', 'error');
      console.error('Supabase error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Workshop Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="hosts" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Hosts</label>
        <input
          type="text"
          id="hosts"
          value={hosts}
          onChange={e => setHosts(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Prerequisites (comma-separated)</label>
        <input
          type="text"
          value={prerequisites}
          onChange={e => setPrerequisites(e.target.value)}
          placeholder="e.g. Python, Pandas"
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Upload Materials</label>
        <div className="mt-2">
          <input
            type="file"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-primary/20 dark:file:text-white"
          />
        </div>
        {uploading && <p className="mt-2 text-sm text-text-muted-light dark:text-gray-300">Uploading...</p>}
        <ul className="mt-4 space-y-2">
          {materials.map((filePath, index) => {
            const fileName = filePath.split('/').pop() || filePath;
            const { data } = supabase.storage.from('materials').getPublicUrl(filePath);
            return (
              <li key={index} className="text-sm">
                <a href={data.publicUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300">{fileName}</a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={uploading}
          className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {workshop ? 'Update Workshop' : 'Create Workshop'}
        </button>
      </div>
    </form>
  );
};

const SessionForm: React.FC<{
  onClose: () => void;
  showNotification: (msg: string, type: 'success' | 'error') => void;
  session?: Session | null;
}> = ({ onClose, showNotification, session }) => {
  const [title, setTitle] = useState(session?.title || '');
  const [date, setDate] = useState(session?.date || '');
  const [description, setDescription] = useState(session?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionData = { title, date, description };

    try {
      if (session) {
        const { error } = await supabase.from('sessions').update(sessionData).eq('id', session.id);
        if (error) throw error;
        showNotification('Session updated successfully!', 'success');
      } else {
        const { error } = await supabase.from('sessions').insert([sessionData]);
        if (error) throw error;
        showNotification('Session added successfully!', 'success');
      }
      onClose();
    } catch (error) {
      showNotification('Failed to save session.', 'error');
      console.error('Supabase error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="session-title" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Session Title</label>
        <input
          type="text"
          id="session-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="session-date" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Date</label>
        <input
          type="date"
          id="session-date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="session-description" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Description</label>
        <textarea
          id="session-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        ></textarea>
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90"
        >
          {session ? 'Update Session' : 'Create Session'}
        </button>
      </div>
    </form>
  );
};

const ChallengeForm: React.FC<{
  onClose: () => void;
  showNotification: (msg: string, type: 'success' | 'error') => void;
  challenge?: Challenge | null;
}> = ({ onClose, showNotification, challenge }) => {
  const [title, setTitle] = useState(challenge?.title || '');
  const [type, setType] = useState<'coding' | 'data'>(challenge?.type || 'coding');
  const [description, setDescription] = useState(challenge?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const challengeData = { title, type, description };

    try {
      if (challenge) {
        const { error } = await supabase.from('challenges').update(challengeData).eq('id', challenge.id);
        if (error) throw error;
        showNotification('Challenge updated successfully!', 'success');
      } else {
        const { error } = await supabase.from('challenges').insert([challengeData]);
        if (error) throw error;
        showNotification('Challenge added successfully!', 'success');
      }
      onClose();
    } catch (error) {
      showNotification('Failed to save challenge.', 'error');
      console.error('Supabase error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="challenge-title" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Challenge Title</label>
        <input
          type="text"
          id="challenge-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="challenge-type" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Type</label>
        <select
          id="challenge-type"
          value={type}
          onChange={e => setType(e.target.value as 'coding' | 'data')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        >
          <option value="coding">Coding</option>
          <option value="data">Data</option>
        </select>
      </div>
      <div>
        <label htmlFor="challenge-description" className="block text-sm font-medium text-text-muted-light dark:text-gray-300">Description</label>
        <textarea
          id="challenge-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800 dark:text-white"
        ></textarea>
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90"
        >
          {challenge ? 'Update Challenge' : 'Create Challenge'}
        </button>
      </div>
    </form>
  );
};

const ManageContent = () => {
  const [activeTab, setActiveTab] = useState('workshops');
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Workshop | Session | Challenge | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Workshop | Session | Challenge | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      const { data, error } = await supabase.from('workshops').select('*');
      if (error) console.error('Error fetching workshops:', error);
      else setWorkshops(data as Workshop[]);
    };
    const fetchSessions = async () => {
      const { data, error } = await supabase.from('sessions').select('*');
      if (error) console.error('Error fetching sessions:', error);
      else setSessions(data as Session[]);
    };
    const fetchChallenges = async () => {
      const { data, error } = await supabase.from('challenges').select('*');
      if (error) console.error('Error fetching challenges:', error);
      else setChallenges(data as Challenge[]);
    };

    fetchWorkshops();
    fetchSessions();
    fetchChallenges();

    const workshopSubscription = supabase.channel('public:workshops')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workshops' }, () => fetchWorkshops())
      .subscribe();
    const sessionSubscription = supabase.channel('public:sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, () => fetchSessions())
      .subscribe();
    const challengeSubscription = supabase.channel('public:challenges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, () => fetchChallenges())
      .subscribe();

    return () => {
      supabase.removeChannel(workshopSubscription);
      supabase.removeChannel(sessionSubscription);
      supabase.removeChannel(challengeSubscription);
    };
  }, []);

  const handleEdit = (item: Workshop | Session | Challenge) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: Workshop | Session | Challenge) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const table = activeTab === 'workshops' ? 'workshops' : activeTab === 'sessions' ? 'sessions' : 'challenges';
        const { error } = await supabase.from(table).delete().eq('id', itemToDelete.id);
        if (error) throw error;
        setNotification({ message: `${activeTab.slice(0, -1)} deleted successfully!`, type: 'success' });
      } catch (error) {
        setNotification({ message: `Failed to delete ${activeTab.slice(0, -1)}.`, type: 'error' });
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-text-main-light dark:text-white">Manage Content</h1>
        <button
          onClick={handleAddNew}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Add New {activeTab.slice(0, -1)}
        </button>
      </header>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('workshops')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'workshops' ? 'border-primary text-primary dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'}`}
          >
            Workshops
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sessions' ? 'border-primary text-primary dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'}`}
          >
            Recorded Sessions
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'challenges' ? 'border-primary text-primary dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500'}`}
          >
            Challenges
          </button>
        </nav>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6">
        {activeTab === 'workshops' && (
          <>
            <h3 className="text-2xl font-bold mb-4 text-text-main-light dark:text-white">Manage Workshops</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="p-4 text-text-main-light dark:text-white">Title</th>
                  <th className="p-4 text-text-main-light dark:text-white">Date</th>
                  <th className="p-4 text-text-main-light dark:text-white">Hosts</th>
                  <th className="p-4 text-text-main-light dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map(ws => (
                  <tr key={ws.id} className="border-b dark:border-gray-700">
                    <td className="p-4 text-text-main-light dark:text-white">{ws.title}</td>
                    <td className="p-4 text-text-muted-light dark:text-gray-300">{ws.date}</td>
                    <td className="p-4 text-text-muted-light dark:text-gray-300">{ws.hosts}</td>
                    <td className="p-4 space-x-4">
                      <button onClick={() => handleEdit(ws)} className="text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                      <button onClick={() => handleDeleteClick(ws)} className="text-red-500 hover:underline dark:text-red-400 dark:hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeTab === 'sessions' && (
          <>
            <h3 className="text-2xl font-bold mb-4 text-text-main-light dark:text-white">Manage Recorded Sessions</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="p-4 text-text-main-light dark:text-white">Title</th>
                  <th className="p-4 text-text-main-light dark:text-white">Date</th>
                  <th className="p-4 text-text-main-light dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id} className="border-b dark:border-gray-700">
                    <td className="p-4 text-text-main-light dark:text-white">{s.title}</td>
                    <td className="p-4 text-text-muted-light dark:text-gray-300">{s.date}</td>
                    <td className="p-4 space-x-4">
                      <button onClick={() => handleEdit(s)} className="text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                      <button onClick={() => handleDeleteClick(s)} className="text-red-500 hover:underline dark:text-red-400 dark:hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeTab === 'challenges' && (
          <>
            <h3 className="text-2xl font-bold mb-4 text-text-main-light dark:text-white">Manage Challenges</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="p-4 text-text-main-light dark:text-white">Title</th>
                  <th className="p-4 text-text-main-light dark:text-white">Type</th>
                  <th className="p-4 text-text-main-light dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map(c => (
                  <tr key={c.id} className="border-b dark:border-gray-700">
                    <td className="p-4 text-text-main-light dark:text-white">{c.title}</td>
                    <td className="p-4 text-text-muted-light dark:text-gray-300">{c.type}</td>
                    <td className="p-4 space-x-4">
                      <button onClick={() => handleEdit(c)} className="text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300">Edit</button>
                      <button onClick={() => handleDeleteClick(c)} className="text-red-500 hover:underline dark:text-red-400 dark:hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentItem ? `Edit ${activeTab.slice(0, -1)}` : `Add a New ${activeTab.slice(0, -1)}`}
      >
        {activeTab === 'workshops' && (
          <WorkshopForm onClose={() => setIsModalOpen(false)} showNotification={showNotification} workshop={currentItem as Workshop | null} />
        )}
        {activeTab === 'sessions' && (
          <SessionForm onClose={() => setIsModalOpen(false)} showNotification={showNotification} session={currentItem as Session | null} />
        )}
        {activeTab === 'challenges' && (
          <ChallengeForm onClose={() => setIsModalOpen(false)} showNotification={showNotification} challenge={currentItem as Challenge | null} />
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="text-text-main-light dark:text-white">
          <p>Are you sure you want to delete the {activeTab.slice(0, -1)} "{itemToDelete?.title}"? This action cannot be undone.</p>
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

export default ManageContent;