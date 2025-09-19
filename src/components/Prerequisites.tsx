const Prerequisites = () => {
  const libraries = ['Pandas', 'NumPy', 'Scikit-learn', 'Jupyter lab or jupyter notebook'];
  const pipCommand = 'pip install pandas numpy scikit-learn jupyterlab';

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-lg p-6">
      <h4 className="text-lg font-bold text-text-main-light dark:text-text-main-dark mb-4">Prerequisites</h4>
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-text-main-light dark:text-text-main-dark mb-2">1- Python Environment:</p>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-2">Please have a Python environment ready (e.g., Anaconda) with the following libraries installed:</p>
          <ul className="list-disc list-inside space-y-1 text-text-muted-light dark:text-text-muted-dark">
            {libraries.map(lib => <li key={lib}>{lib}</li>)}
          </ul>
          <p className="mt-4 text-text-main-light dark:text-text-main-dark">You can install them via pip:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-sm font-mono text-emam-accent mt-2 overflow-x-auto break-words whitespace-pre-wrap">
            <code>{pipCommand}</code>
          </pre>
        </div>
        <div>
          <p className="font-semibold text-text-main-light dark:text-text-main-dark">2- Dataset:</p>
          <p className="text-text-muted-light dark:text-text-muted-dark">The dataset will be provided at the start of the session.</p>
        </div>
        <div>
          <p className="font-semibold text-text-main-light dark:text-text-main-dark">3- (Optional) Review:</p>
          <p className="text-text-muted-light dark:text-text-muted-dark">A quick look at basic DataFrame concepts will be helpful. No advanced preparation is needed.</p>
        </div>
      </div>
    </div>
  );
};

export default Prerequisites;