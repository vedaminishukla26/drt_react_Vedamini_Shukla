import { useContext } from "react";
import { ResultContext } from "../contexts/ResultContext";

const useResults = () => {
  const context = useContext(ResultContext)
  if (!context) {
    throw new Error('useResultContext must be used within a ResultProvider');
  }
  return context;
}

export default useResults;