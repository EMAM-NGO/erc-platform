import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Modal from '../../components/Modal';
import Notification from '../../components/Notification';

// 1. CHANGE: The 'materials' field is now an array of strings (file paths).
interface Workshop {
  id: number;
  title: string;
  date: string;
  hosts: string;
  description: string;
  materials: string[];
  prerequisites: string[];
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
      // 1. Sanitize the file name
      // - Get the file extension (e.g., ".pdf")
      const fileExt = file.name.split('.').pop();
      // - Get the file name without the extension
      const fileName = file.name.substring(0, file.name.lastIndexOf('.'));
      // - Create a clean, URL-safe file name
      const sanitizedFileName = fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // 2. Create a unique path to prevent overwrites
      const uniquePath = `public/${sanitizedFileName}-${Date.now()}.${fileExt}`;

      // 3. Upload using the new unique path
      const { error: uploadError } = await supabase.storage
        .from('materials')
        .upload(uniquePath, file, { upsert: false }); // upsert is false as the name is now unique

      if (uploadError) throw uploadError;

      // 4. Save the new unique path to the state
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
    
    // The 'materials' state now correctly contains an array of file paths.
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
      {/* --- No changes to form inputs --- */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Workshop Title</label>
        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800" />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Date</label>
        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800" />
      </div>
      <div>
        <label htmlFor="hosts" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Hosts</label>
        <input type="text" id="hosts" value={hosts} onChange={e => setHosts(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Description</label>
        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800"></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Prerequisites (comma-separated)</label>
        <input type="text" value={prerequisites} onChange={e => setPrerequisites(e.target.value)} placeholder="e.g. Python, Pandas" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Upload Materials</label>
        <div className="mt-2">
            <input 
              type="file" 
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
        </div>
        {uploading && <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">Uploading...</p>}
        {/* 4. CHANGE: Update the list to display the materials correctly. */}
        <ul className="mt-4 space-y-2">
          {materials.map((filePath, index) => {
            const fileName = filePath.split('/').pop() || filePath;
            // Get the URL dynamically just for the preview link in the form
            const { data } = supabase.storage.from('materials').getPublicUrl(filePath);
            return (
              <li key={index} className="text-sm">
                  <a href={data.publicUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{fileName}</a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" disabled={uploading} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {workshop ? 'Update Workshop' : 'Create Workshop'}
        </button>
      </div>
    </form>
  );
};


// ================================================================================================
// === No changes needed in the main ManageWorkshops component below this line ===
// ================================================================================================

const ManageWorkshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop | null>(null);
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      const { data, error } = await supabase.from('workshops').select('*');
      if (error) console.error('Error fetching workshops:', error);
      else setWorkshops(data as Workshop[]);
    };
    fetchWorkshops();

    const subscription = supabase.channel('public:workshops')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workshops' }, payload => {
        fetchWorkshops();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleEdit = (workshop: Workshop) => {
    setCurrentWorkshop(workshop);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentWorkshop(null);
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (workshop: Workshop) => {
    setWorkshopToDelete(workshop);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (workshopToDelete) {
      try {
        const { error } = await supabase.from('workshops').delete().eq('id', workshopToDelete.id);
        if (error) throw error;
        showNotification('Workshop deleted successfully!', 'success');
      } catch (error) {
        showNotification('Failed to delete workshop.', 'error');
      }
      setDeleteModalOpen(false);
      setWorkshopToDelete(null);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-text-main-light dark:text-text-main-dark">Manage Workshops</h1>
        <button onClick={handleAddNew} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
          <i className="fas fa-plus mr-2"></i> Add New Workshop
        </button>
      </header>

      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-4 text-text-main-light dark:text-text-main-dark">Title</th>
              <th className="p-4 text-text-main-light dark:text-text-main-dark">Date</th>
              <th className="p-4 text-text-main-light dark:text-text-main-dark">Hosts</th>
              <th className="p-4 text-text-main-light dark:text-text-main-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map(ws => (
              <tr key={ws.id} className="border-b dark:border-gray-700">
                <td className="p-4 text-text-main-light dark:text-text-main-dark">{ws.title}</td>
                <td className="p-4 text-text-muted-light dark:text-text-muted-dark">{ws.date}</td>
                <td className="p-4 text-text-muted-light dark:text-text-muted-dark">{ws.hosts}</td>
                <td className="p-4 space-x-4">
                  <button onClick={() => handleEdit(ws)} className="text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDeleteClick(ws)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentWorkshop ? 'Edit Workshop' : 'Add a New Workshop'}>
        <WorkshopForm onClose={() => setIsModalOpen(false)} showNotification={showNotification} workshop={currentWorkshop} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="text-text-main-light dark:text-text-main-dark">
          <p>Are you sure you want to delete the workshop "{workshopToDelete?.title}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={() => setDeleteModalOpen(false)} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-opacity-90">Cancel</button>
            <button onClick={confirmDelete} className="py-2 px-4 rounded-lg bg-red-500 text-white font-bold hover:bg-opacity-90">Delete</button>
          </div>
        </div>
      </Modal>

      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
};

export default ManageWorkshops;