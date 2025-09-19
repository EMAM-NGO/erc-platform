// src/hooks/usePyodide.ts

import { useState, useEffect } from 'react';

interface Pyodide {
  runPython: (code: string) => any;
  runPythonAsync: (code: string) => Promise<any>;
  loadPackage: (packages: string[]) => Promise<void>;
  FS: any;
  globals: any;
  // We'll be using micropip, so let's add its type for safety
  pyimport: (module: string) => any; 
}

// 1. CACHING: Store the Pyodide promise on the window object to avoid re-loading
declare global {
  interface Window {
    pyodidePromise: Promise<Pyodide>;
  }
}

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';

// This function will be called only once
const loadPyodideAndPackages = async (): Promise<Pyodide> => {
  const script = document.createElement('script');
  script.src = PYODIDE_URL;
  document.body.appendChild(script);

  // Wait for the script to load and initialize Pyodide
  await new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load the Pyodide script.'));
  });

  // @ts-ignore: loadPyodide is now on the window object
  const pyodide = await window.loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
  });

  // Load standard packages
  await pyodide.loadPackage([
    'pandas',
    'numpy',
    'scipy',
    'scikit-learn',
    'matplotlib',
    'statsmodels',
    'pyodide-http'
  ]);

  await pyodide.runPythonAsync('import pyodide_http; pyodide_http.patch_all()');
  
  // 2. SEABORN FIX: Load and use micropip to install seaborn
  await pyodide.loadPackage('micropip');
  const micropip = pyodide.pyimport('micropip');
  await micropip.install('seaborn');

  return pyodide;
};

// If the promise doesn't exist on the window, create it.
if (!window.pyodidePromise) {
  window.pyodidePromise = loadPyodideAndPackages();
}

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<Pyodide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const pyodideInstance = await window.pyodidePromise;
        setPyodide(pyodideInstance);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  return { pyodide, isLoading, error };
};