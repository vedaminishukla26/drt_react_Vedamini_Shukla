import React, { useState } from 'react';
import useFilter from '../hooks/useFilter';
import useTheme from '../hooks/useTheme';

const ObjectTypeFilter = () => {

  const { categories, allObjectsSelected, getSelectedCount, selectAll, isCategorySelected, toggleCategory, } = useFilter()

  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
  const { theme } = useTheme();

  return (
    <div className="flex gap-2 mb-4 flex-wrap text-sm">
      <button
        onClick={selectAll}
        className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200  ${theme.shadow.small} ${allObjectsSelected
            ? `${theme.filter.all} ${theme.filter.allHover} shadow-md`
            : `${theme.filter.category} hover:bg-slate-700 hover:text-slate-200`
          }`}
      >
        All Objects ({getSelectedCount()})
      </button>

      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => toggleCategory(category.id)}
          className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${theme.shadow.small} ${isCategorySelected(category.id)
              ? `${theme.filter.categorySelected} shadow-md transform scale-105`
              : `${theme.filter.category} hover:bg-slate-700 hover:text-slate-200`
            }`}
        >
          {category.icon} {category.name} ({category.count})
        </button>
      ))}
    </div>
  );
}

export default ObjectTypeFilter