import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Shorts from './pages/Shorts';
import Subscriptions from './pages/Subscriptions';
import History from './pages/History';
import './App.css';
import ChannelPage from './pages/ChannelPage';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
// import { UserContext } from './context/UserContext';
import { UserProvider } from './context/UserContext';
import ExpandedSidebar from './components/ExpandedSidebar';
// import SearchResultsPage from './pages/SearchResultsPage';
// import SearchResults from './components/SearchResults';
import SearchResultsPage from './pages/SearchResultsPage';
import VideoPage from './pages/VideoPage';
import './styles/global.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 1312);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [user, setUser] = useState(null);

  // const toggleSidebar = () => {
   
  //   // setSidebarCollapsed(prevState => !prevState);
  //   if (window.innerWidth < 1312) {
  //     setSidebarExpanded(!sidebarExpanded);
  //   } else {
  //     setSidebarCollapsed(!sidebarCollapsed);
  //   }
  // };

  const toggleSidebar = () => {
    if (window.innerWidth < 1312) {
      setSidebarExpanded(!sidebarExpanded);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSidebarExpanded(false);
      setIsClosing(false);
    }, 250);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setSidebarCollapsed(window.innerWidth < 1312);
  //     if (window.innerWidth >= 1312) {
  //       setSidebarExpanded(false);
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1312) {
        setSidebarCollapsed(true);
        setSidebarExpanded(false);
      } else {
        setSidebarExpanded(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Call it initially to set the correct state
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  return (
    <UserProvider>
      <Router>
        <div className={`app ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
          <Header toggleSidebar={toggleSidebar} user={user} setUser={setUser} />
          <div className="app__page">
          {window.innerWidth >= 1312 ? (
            <Sidebar collapsed={sidebarCollapsed} />
          ) : (
            <Sidebar collapsed={true} />
          )}
        
          <div className="main-content" >
            <Routes>
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/video/:videoId" element={<VideoPage />} /> 
              <Route path="/" element={<Home />} />
              <Route path="/shorts" element={<Shorts />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/history" element={<History />} />
              <Route path="/channel/:id" element={<ChannelPage />} />
            </Routes>
            </div>
          </div>
          {(sidebarExpanded || isClosing) && (
          <>
            <ExpandedSidebar 
              onClose={handleCloseSidebar} 
              isOpen={sidebarExpanded && !isClosing}
            />
            <div 
              className={`overlay ${isClosing ? 'closing' : ''}`} 
              onClick={handleCloseSidebar}
            ></div>
          </>
        )}
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;