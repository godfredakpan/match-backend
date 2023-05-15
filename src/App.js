// import Footer from "./components/footer/footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'material-react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard';
// import { ToastContainer } from 'material-react-toastify';
import Login from "./components/Login";
import Admin from './components/admin';

const App = () => {
  return (
    <>
      <div>
      <Router>
            <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Dashboard/>} />

            <Route path="admin" element={<Admin/>} />
						
            </Routes>
				</Router>
    </div>
      {/* <Footer /> */}
    </>
  );
};

export default App;
