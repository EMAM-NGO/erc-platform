// pages/WorkshopDetails.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

// 1. UPDATE THE INTERFACE to hold two different URLs
interface Material {
  id: string;
  name: string;
  file_path: string;
  viewUrl: string;
  downloadUrl: string;
}

interface WorkshopMaterialJoinRow {
  materials: {
    id: string;
    name: string;
    file_path: string;
  };
}

interface Workshop {
  id: string;
  title: string;
  date: string;
  hosts: string;
  description: string;
  prerequisites: string[];
  materials: Material[]; 
  workshop_materials: WorkshopMaterialJoinRow[];
}

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.pdf')) {
    return <i className="fas fa-file-pdf text-red-500 mr-3"></i>;
  }
  if (fileName.endsWith('.ipynb')) {
    return <i className="fas fa-file-code text-orange-500 mr-3"></i>;
  }
  return <i className="fas fa-file-alt text-gray-500 mr-3"></i>;
};

const WorkshopDetails = () => {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const { workshopId } = useParams<{ workshopId: string }>();
  const [pdfToView, setPdfToView] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      if (!workshopId) return;
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('workshops')
          .select(`
            *,
            workshop_materials (
              materials (
                id,
                name,
                file_path
              )
            )
          `)
          .eq('id', workshopId)
          .single();

        if (error) throw error;
        
        const extractedMaterials = data.workshop_materials.map((join_row: WorkshopMaterialJoinRow) => join_row.materials);

        // 2. UPDATE THE LOGIC to generate two distinct URLs
        const materialsWithUrls = extractedMaterials.map((material: Omit<Material, 'viewUrl' | 'downloadUrl'>) => {
          // URL for viewing (no download option)
          const { data: viewUrlData } = supabase.storage
            .from('materials')
            .getPublicUrl(material.file_path);

          // URL for downloading (with download option)
          const { data: downloadUrlData } = supabase.storage
            .from('materials')
            .getPublicUrl(material.file_path, { download: true });

          return { 
            ...material, 
            viewUrl: viewUrlData.publicUrl, 
            downloadUrl: downloadUrlData.publicUrl 
          };
        });

        setWorkshop({ ...data, materials: materialsWithUrls });

      } catch (err: any) {
        console.error('Error fetching workshop details:', err);
        setWorkshop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, [workshopId]);

  if (loading) return <div className="text-center p-8">Loading workshop details...</div>;
  if (!workshop) return <div className="text-center p-8">Workshop not found.</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-text-main-light dark:text-text-main-dark mb-4">{workshop.title}</h1>
        <p className="text-lg text-text-muted-light dark:text-text-muted-dark">{workshop.date} | Hosted by {workshop.hosts}</p>
        <p className="mt-4 max-w-3xl mx-auto text-xl text-text-muted-light dark:text-text-muted-dark">"{workshop.description}"</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold mb-6 text-text-main-light dark:text-text-main-dark">Materials</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshop.materials && workshop.materials.length > 0 ? (
              workshop.materials.map((mat) => (
                <div key={mat.id} className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="text-2xl">{getFileIcon(mat.name)}</div>
                      <h4 className="font-bold text-lg text-text-main-light dark:text-white truncate">{mat.name}</h4>
                    </div>
                  </div>
                  {/* 3. UPDATE THE JSX to use the new URLs */}
                  <div className="flex items-center justify-end space-x-3 mt-4">
                    {mat.file_path.endsWith('.pdf') && (
                      <button 
                        onClick={() => setPdfToView(mat.viewUrl)} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View
                      </button>
                    )}
                    <a 
                      href={mat.downloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6">
                <p className="text-text-muted-light dark:text-text-muted-dark text-center">No materials uploaded yet.</p>
              </div>
            )}
          </div>

          {pdfToView && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-text-main-light dark:text-text-main-dark">PDF Viewer</h4>
                <button onClick={() => setPdfToView(null)} className="font-bold py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-opacity-90">
                  Close
                </button>
              </div>
              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-2">
                <iframe
                  src={pdfToView}
                  width="100%"
                  height="800px"
                  title="PDF Viewer"
                  className="rounded-md"
                ></iframe>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <h3 className="text-2xl font-bold mb-6 text-text-main-light dark:text-text-main-dark">Prerequisites</h3>
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6">
            {workshop.prerequisites && workshop.prerequisites.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-text-muted-light dark:text-text-muted-dark">
                {workshop.prerequisites.map((req, index) => <li key={index}>{req}</li>)}
              </ul>
            ) : <p className="text-text-muted-light dark:text-text-muted-dark">No prerequisites for this workshop.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetails;