const TableHeader = () => {
    return (
        <div className="flex items-center px-4 pb-3 bg-slate-900 border-b border-slate-700 text-slate-400 text-xs font-medium">
            <div className="flex-shrink-0 mr-4 w-5"></div> {/* Checkbox column */}
            <div className="w-16 flex-shrink-0">NORAD ID</div>
            <div className="flex-1 min-w-0 px-4">Name</div>
            <div className="w-24 flex-shrink-0">COSPAR ID</div>
            <div className="w-20 flex-shrink-0 px-2">Regime</div>
            <div className="w-16 flex-shrink-0 px-2">Country</div>
            <div className="flex-shrink-0 ml-4 w-4"></div> {/* Status column */}
        </div>
    );
};

export default TableHeader;