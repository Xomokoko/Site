import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import Analytics from './pages/Analytics';
import Links from './pages/Links';
import Cours from './pages/Cours';


function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/link" element={<Links />} />
          <Route path="/Cours" element={<Cours />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;