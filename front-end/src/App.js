import './App.css';
import Login from './pages/login/index';
import Subscribe from './pages/subscribe';
import Home from './pages/home';
import {
  useNavigate,
  Route,
  Routes,
  BrowserRouter as Router,
  useLocation,
  Link
} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/login' exact element={<Login />} />
          <Route path='/subscribe' exact element={<Subscribe />} />
          <Route path='/' exact element={<Home />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
