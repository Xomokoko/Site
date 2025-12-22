import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import Analytics from './pages/Analytics';
import Links from './pages/Links';
import Cours from './pages/Cours';


function App() {
  return (
    <Router>
      <ModalProvider>
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
      </ModalProvider>
    </Router>
  );
}

export default App;