import { Check } from "lucide-react";
import ObjectTypeIndicator from "./ObjectTypeIndicator";
import useResults from "../hooks/useResults";

const ResultRow = ({ index, style }) => {
    const { items, selectedItems, toggleSelection, hasMore } = useResults();

    // Show loading row
    if (index >= items.length) {
        return (
            <div style={style} className="flex items-center justify-center h-12 bg-slate-800 text-slate-400">
                Loading...
            </div>
        );
    }

    const item = items[index];
    const isSelected = selectedItems.has(item.noradId);

    return (
        <div
            style={style}
            className={`flex items-center px-4 py-2 border-b border-slate-700 hover:bg-slate-700 transition-colors ${isSelected ? 'bg-slate-750' : 'bg-slate-800'
                }`}
        >
            {/* Checkbox */}
            <div className="flex-shrink-0 mr-4">
                <button
                    onClick={() => toggleSelection(item.noradId)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-slate-500 hover:border-slate-400'
                        }`}
                >
                    {isSelected && <Check size={12} className="text-white" />}
                </button>
            </div>

            {/* NORAD ID */}
            <div className="w-16 flex-shrink-0 text-slate-300 text-sm">
                {item.noradId}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0 px-4">
                <div className="text-white text-sm font-medium truncate">
                    {item.name}
                </div>
            </div>

            {/* COSPAR ID */}
            <div className="w-24 flex-shrink-0 text-slate-300 text-sm">
                {item.cosparId}
            </div>

            {/* Regime */}
            <div className="w-20 flex-shrink-0 text-slate-300 text-sm px-2">
                {item.regime}
            </div>

            {/* Country */}
            <div className="w-16 flex-shrink-0 text-slate-300 text-sm px-2">
                {item.country}
            </div>

            <div className="flex-shrink-0 ml-4">
                <ObjectTypeIndicator status={item.status} />
            </div>
        </div>
    );
};

export default ResultRow;