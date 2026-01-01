import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

import Weather from './components/Dashboard/Weather';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import ForgotPassword from './components/Authentication/ForgotPassword';
import Subscriptions from './components/Subscription/Subscriptions';
import Country from './components/Country/Country';
import Banner from './components/Banner/Banner';



const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4 }
};


const AnimatedPage = ({ children }) => (
  <motion.div
    initial={pageTransition.initial}
    animate={pageTransition.animate}
    exit={pageTransition.exit}
    transition={pageTransition.transition}
  >
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
          <Route path="/weather" element={<AnimatedPage><Weather /></AnimatedPage>} />
          <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
          <Route path="/subscriptions" element={<AnimatedPage><Subscriptions /></AnimatedPage>} />
          <Route path="/Country" element={<AnimatedPage><Country /></AnimatedPage>} />
          <Route path="/Banner" element={<AnimatedPage><Banner /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
