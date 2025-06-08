import './App.css'
import FilterBar from './components/FilterBar';
import FilterProvider from './contexts/FilterContext';
import ThemeProvider from './contexts/ThemeContext';
import ResultProvider from './contexts/ResultContext';

function App() {

  return (
    <>
      <ThemeProvider>
        <ResultProvider>
          <FilterProvider>
          
            <FilterBar />
            {/* <DataTable /> */}
          
        </FilterProvider>
        </ResultProvider >
      </ThemeProvider>
    </>
  )
}

export default App
