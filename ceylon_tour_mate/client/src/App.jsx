import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="relative">
          <div className="absolute top-0 right-0 left-0 z-50">
            <Navbar />
          </div>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;