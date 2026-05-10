'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { Category } from '@/types/product';

interface FilterSidebarProps {
  categories: Category[];
  expandedFilters: string[];
  toggleFilter: (filter: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

const FilterSidebar = ({
  categories,
  expandedFilters,
  toggleFilter,
  selectedCategory,
  onSelectCategory,
}: FilterSidebarProps) => {
  const isExpanded = (key: string) => expandedFilters.includes(key);

  return (
    <aside className="w-full lg:w-[240px] shrink-0 font-playfair">
      {/* Categories */}
      <div className="mb-6">
        <button
          className="flex justify-between items-center w-full text-[13px] font-bold uppercase tracking-widest mb-4 hover:opacity-70 transition-opacity"
          onClick={() => toggleFilter('FINDÉA COLLECTION')}
        >
          <span>FINDÉA COLLECTION</span>
          {isExpanded('FINDÉA COLLECTION') ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {isExpanded('FINDÉA COLLECTION') && (
          <ul className="space-y-2 pl-1">
            <li>
              <button
                onClick={() => onSelectCategory(null)}
                className={`text-[14px] w-full text-left py-1 transition-colors ${
                  selectedCategory === null ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
                }`}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <button
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`text-[14px] w-full text-left py-1 transition-colors ${
                    selectedCategory === cat.slug ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full h-[1px] bg-gray-200 mb-6" />

      {/* Price */}
      <div className="mb-6">
        <button
          className="flex justify-between items-center w-full text-[13px] font-bold uppercase tracking-widest mb-4 hover:opacity-70 transition-opacity"
          onClick={() => toggleFilter('PRICE')}
        >
          <span>PRICE</span>
          {isExpanded('PRICE') ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {isExpanded('PRICE') && (
          <p className="text-[13px] text-gray-500 pl-1">Use sort to filter by price.</p>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
