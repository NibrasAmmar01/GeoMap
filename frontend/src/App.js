import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import AddGeoMap from './Components/AddGeoMap';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/map/:name' Component={AddGeoMap}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
