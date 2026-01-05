import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import { TimerProvider } from './contexts/TimerContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import Analytics from './pages/Analytics';
import Links from './pages/Links';
import Cours from './pages/Cours';
import Settings from './pages/Settings';



function App() {
  return (
    <Router>
      <ModalProvider>
        <TimerProvider>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/link" element={<Links />} />
              <Route path="/Cours" element={<Cours />} />
              <Route path="/settings" element={<Settings />} />

            </Routes>
          </div>
        </TimerProvider>
      </ModalProvider>
    </Router>
  );
}

export default App;