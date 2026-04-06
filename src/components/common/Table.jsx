import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Loader from './Loader';
import EmptyState from './EmptyState';

export default function Table({ columns, data, loading, sortKey, sortDir, onSort, onRowClick }) {
  if (loading) return <Loader className="py-12" />;
  if (!data || data.length === 0) return <EmptyState message="No data found" />;

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th 
                    key={col.key} 
                    className={`text-left px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${col.sortable ? 'cursor-pointer select-none hover:text-slate-600 transition-colors' : ''}`}
                    onClick={() => { if (col.sortable && onSort) onSort(col.key); }}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable && isSorted && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-teal-600" /> : <ChevronDown className="w-3 h-3 text-teal-600" />)}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((row, i) => (
              <tr 
                key={row.id || i} 
                onClick={() => { if (onRowClick) onRowClick(row); }}
                className={`hover:bg-slate-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-[12px] font-medium text-slate-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}