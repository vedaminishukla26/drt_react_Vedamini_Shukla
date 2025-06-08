import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import useResults from '../hooks/useResults';

const SideList = () => {
  const { selectedItems, isCollapsed, toggleCollapse, clearAll, removeItem, items } = useResults()
  const selectedDataItems = items.filter(item => selectedItems.has(item.noradId))

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-80'
      } bg-slate-800 border-l border-slate-700 flex flex-col transition-all duration-300 ease-in-out relative h-full`}>
      <button
        onClick={toggleCollapse}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3 bg-slate-700 hover:bg-slate-600 text-white p-1 rounded-full z-10 transition-colors"
      >
        {isCollapsed ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {!isCollapsed && (
        <>
          <div className="p-4 border-b border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white font-semibold">Selected Assets</h2>
              <button
                onClick={clearAll}
                className="text-slate-400 hover:text-slate-300 text-sm"
              >
                Clear all ✕
              </button>
            </div>
            <div className="text-cyan-400 text-sm">
              {selectedItems.size} objects selected
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {selectedDataItems.map((item) => (
              <div key={item.noradId} className="flex justify-between items-center p-3 border-b border-slate-700">
                <div>
                  <div className="text-white text-sm">{item.noradId}</div>
                  <div className="text-slate-300 text-xs">{item.name}</div>
                </div>
                <button
                  onClick={() => removeItem(item.noradId)}
                  className="text-slate-400 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4">
            <button className="w-full bg-cyan-400 text-slate-900 py-3 rounded font-semibold hover:bg-cyan-300 transition-colors">
              PROCEED
            </button>
          </div>
        </>
      )}
      {isCollapsed && (
        <div className="p-2 flex flex-col items-center justify-center h-full">
          <div className="text-white text-xs mb-2 transform -rotate-90 whitespace-nowrap">
            Selected
          </div>
          <div className="bg-cyan-400 text-white rounded-full -rotate-90 mt-3 w-6 h-6 flex items-center justify-center text-xs font-bold">
            {selectedDataItems.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideList;
