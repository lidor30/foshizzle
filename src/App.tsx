import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import { StatsProvider } from "./context/StatsContext";
import HomePage from "./pages/HomePage";
import SessionPage from "./pages/SessionPage";

function App() {
  return (
    <StatsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StatsProvider>
  );
}

export default App;
