import { useContext } from "react";
import { FilterContext } from "../contexts/FilterContext";

const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export default useFilter;