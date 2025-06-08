import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { FilterContext } from "../contexts/FilterContext";

const OrbitCodeDropdown = () => {
  const {
    orbitCodeOptions,
    selectedOrbitCodes,
    toggleOrbitCode,
    clearOrbitCodes
  } = useContext(FilterContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-between items-center w-48 px-3 py-2 bg-slate-700 text-white rounded"
        onClick={() => setOpen((o) => !o)}
      >
        Orbitcode
        <span className="ml-2">&#9660;</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-48 bg-slate-700 rounded shadow-lg max-h-60 overflow-y-auto">
          <button
            className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-slate-500"
            onClick={() => {
              clearOrbitCodes();
            }}
          >
            Clear All
          </button>
          {orbitCodeOptions.map((code) => (
            <label
              key={code}
              className="flex items-center px-3 py-2 text-sm text-white cursor-pointer hover:bg-slate-500"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedOrbitCodes.includes(code)}
                onChange={() => toggleOrbitCode(code)}
              />
              {code}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrbitCodeDropdown;
