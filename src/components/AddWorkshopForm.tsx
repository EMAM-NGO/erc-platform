const AddWorkshopForm = () => {
  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Workshop Title</label>
        <input type="text" id="title" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800" />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Date</label>
        <input type="date" id="date" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800" />
      </div>
      <div>
        <label htmlFor="hosts" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Hosts</label>
        <input type="text" id="hosts" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Description</label>
        <textarea id="description" rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-800"></textarea>
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90">
          Create Workshop
        </button>
      </div>
    </form>
  );
};

export default AddWorkshopForm;