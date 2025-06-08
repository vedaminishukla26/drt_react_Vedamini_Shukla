import { Check, Search, X } from 'lucide-react';
import ObjectTypeFilter from './ObjectTypeFilter';
import useFilter from '../hooks/useFilter';
import OrbitCodeDropdown from './OrbitCodeDropdown';
import useTheme from '../hooks/useTheme';
import SideList from './SideList';
import SatelliteTable from './SatelliteTable';
import useResults from '../hooks/useResults';

const FilterBar = () => {
  const { getSelectedCount, applyFilters } = useFilter();
  const handleInputChange = (e) => setSearchTerm(e.target.value);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const { isCollapsed, loading, error, totalCount, allItems, searchTerm, setItems, 
    setTotalCount, filterItems, setSearchTerm, selectAllItems, toggleSelectAllItems, isSelectAllItems} = useResults()

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const filteredItems = filterItems(allItems, searchTerm);
      setItems(filteredItems);
      setTotalCount(filteredItems.length);
    }
  };

  const handleClear = () => setSearchTerm("");

  const handleApplyFilters = () => {
    console.log("applyFilters");
    applyFilters();
  };

  return (
    <div className={`min-h-screen flex flex-row justify-between m-0 transition-colors duration-200 ${theme.bg.primary}`}>
      <div className='flex-1 p-6 transition-all duration-300 mr-12'>
        <div className="flex justify-between items-center mb-4">
          <h1 className={` text-2xl font-bold mb-4 text-start ${theme.text.primary}`}>Create My Asset List</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-200 ${theme.button.secondary} ${theme.shadow.small}`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

         {/* Error Display */}
         {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Filter Tabs */}
        <ObjectTypeFilter />

        {/* Search and Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-full">
            <input
              type="text"
              placeholder="Search by Name/NORAD ID"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={` px-3 py-2 pr-10 rounded text-sm w-full ${theme.input.bg} ${theme.input.text} ${theme.input.placeholder} ${theme.input.border}`}
            />
            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                className={`absolute right-9 top-2.5 w-4 h-4 ${theme.text.muted} hover:{theme.text.secondary}`}
                onClick={handleClear}
                tabIndex={0}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Search className={`absolute right-3 top-2.5 w-4 h-4 ${theme.text.muted}`} />
          </div>

          <div className="flex gap-2">
            <OrbitCodeDropdown />
            <select className={`${theme.dropdown.bg} ${theme.dropdown.text} ${theme.dropdown.border} px-3 py-2 rounded text-sm`}>
              <option>Constellation</option>
            </select>
            <select className={`${theme.dropdown.bg} ${theme.dropdown.text} ${theme.dropdown.border} px-3 py-2 rounded text-sm`}>
              <option>Country</option>
            </select>
            <select className={`${theme.dropdown.bg} ${theme.dropdown.text} ${theme.dropdown.border} px-3 py-2 rounded text-sm`}>
              <option>Purpose</option>
            </select>
            <select className={`${theme.dropdown.bg} ${theme.dropdown.text} ${theme.dropdown.border} px-3 py-2 rounded text-sm`}>
              <option>Regime</option>
            </select>
          </div>

          <button className={`${theme.text.muted} hover:text-red-300`}>
            🗑️
          </button>
        </div>

        <div className="flex flex-row justify-between items-center mt-4">
          <div className={`${theme.text.muted} text-sm mt-2 text-start`}>
          { (
              <div className='flex flex-row' > 
              <div className="flex-shrink-0 mr-4">
             <button
                 onClick={toggleSelectAllItems}
                 className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelectAllItems
                     ? 'bg-blue-600 border-blue-600'
                     : 'border-slate-500 hover:border-slate-400'
                     }`}
             >
                 {isSelectAllItems && <Check size={12} className="text-white" />}
             </button>
             </div>
             <div className="text-sm">Select all</div></div>
            )}
          </div>

          <button className="p-[2px] relative justify-end" onClick={handleApplyFilters}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-6 py-1 bg-slate-700 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
              Apply Filters
            </div>
          </button>
        </div>

        <SatelliteTable />

      </div>


      <div className={`${isCollapsed ? 'w-12' : 'w-80'} transition-all duration-300 `}>
        <SideList />
      </div>

    </div>
  );
};

export default FilterBar;