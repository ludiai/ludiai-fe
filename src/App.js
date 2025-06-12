import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CraftSearch from "./CraftSearch";
import LandingPage from "./LandingPage";
import SearchAnalyzer from "./components/SearchAnalyzer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<CraftSearch />} />
        <Route path="/query-analyzer" element={<SearchAnalyzer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
