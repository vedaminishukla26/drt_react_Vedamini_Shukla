import { useCallback } from "react";
import { FixedSizeList as List } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import TableHeader from "./TableHeader";
import ResultRow from "./ResultRow";
import useResults from "../hooks/useResults";
import useTheme from "../hooks/useTheme";

const SatelliteTable = () => {
    const { items, hasMore, loadMoreItems , loading, error, searchTerm, totalCount} = useResults();
    const { theme } = useTheme();
    const itemCount = hasMore ? items.length + 1 : items.length;

    // Show loading state
    if (loading && items.length === 0) {
        return (
            <div className={`w-full mt-4 max-w-6xl mx-auto ${theme.bg.secondary} rounded-lg overflow-hidden shadow-lg`}>
                <TableHeader />
                <div className="flex justify-center items-center h-40">
                    <div className={`${theme.text.primary} text-lg`}>
                        Loading satellite data...
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && items.length === 0) {
        return (
            <div className={`w-full mt-4 max-w-6xl mx-auto ${theme.bg.secondary} rounded-lg overflow-hidden shadow-lg`}>
                <TableHeader />
                <div className="flex justify-center items-center h-40">
                    <div className="text-red-500 text-lg">
                        Error loading data: {error}
                    </div>
                </div>
            </div>
        );
    }

     // Show empty state
     if (!loading && items.length === 0) {
        return (
            <div className={`w-full mt-4 max-w-6xl mx-auto ${theme.bg.secondary} rounded-lg overflow-hidden shadow-lg`}>
                <TableHeader />
                <div className="flex justify-center items-center h-40">
                    <div className={`${theme.text.muted} text-lg`}>
                        No satellites found. Try adjusting your filters.
                    </div>
                </div>
            </div>
        );
    }

    if (loading && items.length > 0 && searchTerm === ""){  
        return (
            <div className={`w-full mt-4 max-w-6xl mx-auto ${theme.bg.secondary} rounded-lg overflow-hidden shadow-lg`}>
                <TableHeader />
                <div className="flex justify-center items-center h-40">
                    <div className={`${theme.text.muted} text-lg`}>
                        Updating data...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full mt-4 max-w-6xl mx-auto ${theme.bg.secondary} rounded-lg overflow-hidden shadow-lg`}>
            <TableHeader />
            <div className="relative">
                
                <InfiniteLoader
                    isItemLoaded={index => !!items[index]}
                    itemCount={itemCount}
                    loadMoreItems={loadMoreItems}
                >
                    {({ onItemsRendered, ref }) => (
                        <List
                            height={400}
                            itemCount={itemCount}
                            itemSize={48}
                            width="100%"
                            onItemsRendered={onItemsRendered}
                            ref={ref}
                        >
                            {ResultRow}
                        </List>
                    )}
                </InfiniteLoader>
            </div>
        </div>
    );
};

export default SatelliteTable;