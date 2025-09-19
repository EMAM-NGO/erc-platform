// src/components/DataFrameViewer.tsx

import React from 'react';

type Row = Record<string, any>;

// Add the "export" keyword here
export interface TableData {
  columns: string[];
  data: Row[];
}

interface DataFrameViewerProps {
  tableData: TableData;
}

const DataFrameViewer: React.FC<DataFrameViewerProps> = ({ tableData }) => {
  // Check for valid data structure
  if (!tableData || !Array.isArray(tableData.columns) || !Array.isArray(tableData.data)) {
    return <p className="p-4 font-mono text-sm">Invalid or missing table data.</p>;
  }

  const { columns: headers, data } = tableData;

  return (
    <div className="overflow-x-auto rounded-md bg-gray-100 dark:bg-gray-800">
      <table className="min-w-full text-sm text-left text-text-muted-light dark:text-text-muted-dark">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            {headers.map(header => (
              <th key={header} scope="col" className="px-4 py-2 font-mono font-bold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-200 dark:border-gray-700">
              {headers.map(header => (
                <td key={`${rowIndex}-${header}`} className="px-4 py-2 font-mono">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataFrameViewer;