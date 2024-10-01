import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Don't forget to import the CSS
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/statistics" element={<Statistics/>}/>
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
