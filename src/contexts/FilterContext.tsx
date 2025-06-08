import React, { createContext, useContext, useState, useEffect} from 'react';
import { ResultContext } from './ResultContext';

export const FilterContext = createContext({});

const FilterProvider = ({ children }) => {
  const [allObjectsSelected, setAllObjectsSelected] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const [selectedOrbitCodes, setSelectedOrbitCodes] = useState([]);

  const { counts, refreshData, filterByOrbitCodes, items, setItems, setTotalCount, searchedItems, allItems } = useContext(ResultContext);

  const categories = [
    { id: 'PAYLOAD', name: 'Payloads', count: 14035, icon: '•' },
    { id: 'DEBRIS', name: 'Debris', count: 10588, icon: '⚪' },
    { id: 'ROCKET BODY', name: 'Rocket Bodies', count: 2167, icon: '▲' },
    { id: 'UNKNOWN', name: 'Unknown', count: 557, icon: '◆' }
  ];

  const orbitCodeOptions = [
    "LEO", "LEO1", "LEO2", "LEO3", "LEO4", "MEO", "GEO", "HEO", "IGO", "EGO",
    "NSO", "GTO", "GHO", "HAO", "MGO", "LMO", "UFO", "ESO", "UNKNOWN"
  ];

  const selectAll = () => {
    setAllObjectsSelected(true);
    setSelectedCategories([]);
  };

  const toggleCategory = (categoryId) => {
    setAllObjectsSelected(false);
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Remove category
        const newSelection = prev.filter(id => id !== categoryId);
        // If no categories selected, select all objects
        if (newSelection.length === 0) {
          setAllObjectsSelected(true);
        }
        return newSelection;
      } else {
        // Add category
        return [...prev, categoryId];
      }
    });
  };

  const isCategorySelected = (categoryId) => {
    return !allObjectsSelected && selectedCategories.includes(categoryId);
  };

  const getSelectedCount = () => {
    if (allObjectsSelected) {
      return counts.total || 0;
    }
    return categories
      .filter(cat => selectedCategories.includes(cat.id))
      .reduce((sum, cat) => sum + cat.count, 0);
  };

  const getSelectedCategories = () => {
    if (allObjectsSelected) {
      return categories.map(cat => cat.id);
    }
    return selectedCategories;
  };

  // Add handler for toggling orbit codes
  const toggleOrbitCode = (code) => {
    setSelectedOrbitCodes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const toggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getSymbol = (type) => {
    switch (type) {
      case 'payload': return '•';
      case 'rocket': return '▲';
      case 'debris': return '⚪';
      default: return '•';
    }
  };

  // Handler to clear all orbit codes
  const clearOrbitCodes = () => setSelectedOrbitCodes([]);

  // Function to apply filters and refresh data
  const applyFilters = () => {
    const itemsToFilter = (!searchedItems || searchedItems.length === 0 ) ? allItems : searchedItems
    const filteredItems = filterByOrbitCodes(itemsToFilter, selectedOrbitCodes);
      
    // Update the displayed items and total count
    setItems(filteredItems);
    setTotalCount(filteredItems.length);

  };

  // Effect to apply filters when categories change
  useEffect(() => {
    if (counts.total > 0) { // Only apply filters after initial data is loaded
      const objectTypesToFetch = getSelectedCategories();
      console.log("objectTypesToFetch", objectTypesToFetch);
      // Call the API with selected object types
      refreshData(objectTypesToFetch);
    }
  }, [selectedCategories, allObjectsSelected]);


  const value = {
    // State
    allObjectsSelected,
    selectedCategories,
    categories,
    selectedOrbitCodes,
    orbitCodeOptions,


    // Functions
    selectAll,
    toggleCategory,
    isCategorySelected,
    getSelectedCount,
    getSelectedCategories,
    toggleOrbitCode,
    clearOrbitCodes,
    getSymbol,
    applyFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export default FilterProvider