import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';

export const ResultContext = createContext();

const API_BASE_URL = 'https://backend.digantara.dev/v1/satellites';

const ResultProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [searchedItems, setSearchedItems] = useState([]);
    const [isSelectAllItems, setIsSelectAllItems] = useState(false);
    const [additionalItems, setAdditionalItems] = useState(new Set());
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [counts, setCounts] = useState({
        total: 0,
        PAYLOAD: 0,
        'ROCKET BODY': 0,
        UNKNOWN: 0,
        DEBRIS: 0
    });

    const toggleSelectAllItems = () => {
        if (isSelectAllItems) {
            const newSelection = new Set(Array.from(selectedItems).filter(id => !additionalItems.has(id)));
            setSelectedItems(newSelection);
            setAdditionalItems(new Set())
            setIsSelectAllItems(false)
        } else {
            // If not all items are selected, select the first 10 items
            const top10Items = items.slice(0, 10);
            let selectedTop10ItemsCount = Array.from(selectedItems).filter(id => top10Items.some(item => item.noradId === id)).length;
            if(selectedTop10ItemsCount == 0) selectedTop10ItemsCount = -1 * selectedItems.size
            else if(selectedTop10ItemsCount > 0) selectedTop10ItemsCount = 0
            const itemsToSelect = items.slice(0, 10+selectedTop10ItemsCount).filter(item => !selectedItems.has(item.noradId));
            const newSelection = new Set(Array.from(selectedItems).concat(itemsToSelect.map(item => item.noradId)));
            setAdditionalItems(new Set(itemsToSelect.map(item => item.noradId)))
            setSelectedItems(newSelection);
            setIsSelectAllItems(true)
        }
    };

    // Function to filter items based on search term
    const filterItems = useCallback((itemsToFilter, searchTerm) => {
        if (!searchTerm || searchTerm.trim() === '') {
            setSearchedItems(itemsToFilter)
            return itemsToFilter;
        }

        const term = searchTerm.toLowerCase().trim();
        const filteredItems =  itemsToFilter.filter(item => {
            // Search by name
            const nameMatch = item.name && item.name.toLowerCase().includes(term);
            
            // Search by NORAD ID (convert to string for search)
            const noradMatch = item.noradId && item.noradId.toString().includes(term);
            
            
            return nameMatch || noradMatch ;
        });
        setSearchedItems(filteredItems)
        return filteredItems
    }, []);

    const filterByOrbitCodes = useCallback((itemsToFilter, selectedOrbitCodes) => {
        if (!selectedOrbitCodes || selectedOrbitCodes.length === 0) {
            return itemsToFilter ;
        }

        return itemsToFilter.filter(item => {
            // Handle cases where regime might be null, undefined, or different formats
            const itemRegime = item.regime || 'UNKNOWN';
            return selectedOrbitCodes.includes(itemRegime.toUpperCase());
        });
    }, []);

    // Function to build query parameters
    const buildQueryParams = useCallback((objectTypes = []) => {
        const params = new URLSearchParams();
        
        // Default object types if none specified
        const defaultObjectTypes = ['ROCKET BODY', 'DEBRIS', 'UNKNOWN', 'PAYLOAD'];
        const typesToUse = objectTypes?.length > 0 ? objectTypes : defaultObjectTypes;
        params.append('objectTypes', typesToUse.join(','));
        
        // Default attributes if none specified
        const defaultAttributes = ['noradCatId', 'intlDes', 'name', 'launchDate', 'decayDate', 'objectType', 'launchSiteCode', 'countryCode', 'orbitCode'];
        params.append('attributes', defaultAttributes.join(','));
        
        return params.toString();
    }, []);

    // Function to fetch satellites data
    const fetchSatellites = useCallback(async (objectTypes = []) => {
        setLoading(true);
        setError(null);
        
        try {
            const queryParams = buildQueryParams(objectTypes);
            const response = await fetch(`${API_BASE_URL}?${queryParams}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.statusCode && result.statusCode !== 200) {
                throw new Error(result.message || 'API request failed');
            }

            // Transform the API data to match our component structure
            const transformedData = result.data.map(item => ({
                noradId: parseInt(item.noradCatId),
                name: item.name,
                cosparId: item.intlDes,
                regime: item.orbitCode ? item.orbitCode.replace(/[{}]/g, '') : 'Unknown', // Remove curly braces
                country: item.countryCode,
                status: item.objectType === 'PAYLOAD' ? 'active' : 
                       item.objectType === 'DEBRIS' ? 'debris' : 
                       item.objectType === 'ROCKET BODY' ? 'debris' : 'unknown',
                objectType: item.objectType,
                launchDate: item.launchDate,
                decayDate: item.decayDate,
                launchSiteCode: item.launchSiteCode
            }));

            setAllItems(transformedData);
            setItems(transformedData);
            setTotalCount(transformedData.length);
            
            // If the API provides counts, use them; otherwise calculate from data
            if (result.counts) {
                setCounts({
                    total: parseInt(result.counts.total),
                    PAYLOAD: parseInt(result.counts.PAYLOAD),
                    'ROCKET BODY': parseInt(result.counts['ROCKET BODY']),
                    UNKNOWN: parseInt(result.counts.UNKNOWN),
                    DEBRIS: parseInt(result.counts.DEBRIS)
                });
            } else {
                // Calculate counts from the received data
                const calculatedCounts = transformedData.reduce((acc, item) => {
                    acc[item.objectType] = (acc[item.objectType] || 0) + 1;
                    acc.total += 1;
                    return acc;
                }, { total: 0, PAYLOAD: 0, 'ROCKET BODY': 0, UNKNOWN: 0, DEBRIS: 0 });
                setCounts(calculatedCounts);
            }
            
            setHasMore(false); // Assuming API returns all data at once
        } catch (err) {
            setError(err.message);
            console.error('Error fetching satellites:', err);
        } finally {
            setLoading(false);
        }
    }, [buildQueryParams]);

    // Initial data fetch on component mount
    useEffect(() => {
        fetchSatellites();
    }, [fetchSatellites]);

    // Function to refresh data with specific filters
    const refreshData = useCallback((objectTypes = []) => {
        fetchSatellites(objectTypes);
        console.log("objectTypes", objectTypes);
    }, [fetchSatellites]);

    const removeItem = (id) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const clearAll = () => {
        setSelectedItems(new Set([]));
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleSelection = useCallback((noradId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(noradId)) {
                newSet.delete(noradId);
            } else {
                newSet.add(noradId);
            }
            return newSet;
        });
    }, []);

    const loadMoreItems = useCallback(async (startIndex, stopIndex) => {
        if (loading) return;
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo, stop loading after initial data
        setHasMore(false);
        setLoading(false);
    }, [loading]);

    const contextValue = {
        items,
        allItems,
        selectedItems,
        hasMore,
        loading,
        error,
        totalCount,
        counts,
        searchTerm,
        setSearchTerm,
        toggleSelection,
        loadMoreItems,
        setItems,
        isCollapsed,
        toggleCollapse,
        clearAll,
        removeItem,
        refreshData,
        fetchSatellites,
        filterItems,
        filterByOrbitCodes,
        toggleSelectAllItems,
        isSelectAllItems
    };

    return (
        <ResultContext.Provider value={contextValue}>
            {children}
        </ResultContext.Provider>
    );
};

export default ResultProvider;