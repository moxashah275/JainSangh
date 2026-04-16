import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Skeleton, { TableSkeleton } from './Skeleton';
import EmptyState from './EmptyState';

export default function Table({  // Add 'default' here
  columns,
  data,
  loading,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  emptyMessage = 'No data found',
  emptyDescription,
  emptyAction,
  rowKey = 'id',
  skipCard = false,
}) {
  if (loading) return (
    <div className="p-4 bg-white rounded-xl border border-slate-100">
      <TableSkeleton rows={8} columns={columns?.length || 5} />
    </div>
  );
  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} description={emptyDescription} action={emptyAction} />;
  }

  const tableWrapperClass = skipCard 
    ? "overflow-hidden" 
    : "border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm";

  return (
    <div className={tableWrapperClass}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-100">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th 
                    key={col.key} 
                    className={`${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${col.sortable ? 'cursor-pointer select-none hover:text-slate-600 transition-colors' : ''}`}
                    onClick={() => { if (col.sortable && onSort) onSort(col.key); }}
                  >
                    <span className={`inline-flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                      {col.label}
                      {col.sortable && isSorted && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-teal-600" /> : <ChevronDown className="w-3 h-3 text-teal-600" />)}
                    </span>
                  </th>
                );
              })}
             </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((row, i) => (
              <tr 
                key={row?.[rowKey] || i} 
                onClick={() => { if (onRowClick) onRowClick(row); }}
                className={`hover:bg-slate-50/80 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 text-[12px] font-medium text-slate-700 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {col.render ? col.render(row?.[col.key], row, i) : row?.[col.key]}
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

// Also export Skeleton and TableSkeleton if needed elsewhere
export { Skeleton, TableSkeleton };