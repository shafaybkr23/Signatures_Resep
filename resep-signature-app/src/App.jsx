import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
import Resep from './pages/Resep';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Resep />} />
        {/* <Route path="/resep" element={<Resep />} /> */}
      </Routes>
    </Router>
  );
}

export default App;