// src/globals.d.ts

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
  }
}

// You must add this line to make it a module.
// It can be empty.
export {};