import React, { useState } from 'react';
import { storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

type FileUploadProps = {
  onUploadComplete: (url: string) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const storageRef = ref(storage, `materials/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      }, 
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUploadComplete(downloadURL);
          setFile(null);
          setProgress(0);
        });
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
      {file && (
        <div className="mt-4">
          <button onClick={handleUpload} className="bg-primary text-white font-bold py-2 px-4 rounded-lg">
            Upload
          </button>
          {progress > 0 && <p className="mt-2">Uploading: {progress}%</p>}
        </div>
      )}
    </div>
  );
};

export default FileUpload;