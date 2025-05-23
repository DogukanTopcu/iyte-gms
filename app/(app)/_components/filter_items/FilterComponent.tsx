'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  id: string;
  label: string;
  options: FilterOption[];
};

type FilterComponentProps = {
  filters: FilterConfig[];
  onFilterChange: (filterId: string, value: string | null) => void;
  activeFilters: Record<string, string | null>;
};

export default function FilterComponent({
  filters,
  onFilterChange,
  activeFilters,
}: FilterComponentProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (filterId: string) => {
    setOpenDropdown(openDropdown === filterId ? null : filterId);
  };

  const handleFilterSelect = (filterId: string, value: string) => {
    onFilterChange(filterId, value);
    setOpenDropdown(null);
  };

  const clearFilter = (filterId: string) => {
    onFilterChange(filterId, null);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => (
        <div key={filter.id} className="relative">
          <button
            onClick={() => toggleDropdown(filter.id)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-white border rounded-md shadow-sm hover:bg-gray-50"
          >
            <span>{filter.label}</span>
            {activeFilters[filter.id] ? (
              <div className="flex items-center gap-1 ml-1 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {filter.options.find(opt => opt.value === activeFilters[filter.id])?.label || activeFilters[filter.id]}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilter(filter.id);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          
          {openDropdown === filter.id && (
            <div className="absolute z-10 w-48 mt-1 bg-white border rounded-md shadow-lg">
              <ul className="py-1 max-h-60 overflow-auto">
                {filter.options.map((option) => (
                  <li
                    key={option.value}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      activeFilters[filter.id] === option.value ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                    onClick={() => handleFilterSelect(filter.id, option.value)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 