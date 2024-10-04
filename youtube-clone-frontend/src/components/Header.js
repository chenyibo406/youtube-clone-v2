import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from '../firebase';

function Header({ toggleSidebar, user, setUser }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showProfileBox, setShowProfileBox] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  // const [showProfileBox, setShowProfileBox] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
 // Add this line

  const searchContainerRef = useRef(null);
  const profileBoxRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchValue.trim()) {
      setShowRecentSearches(true);
    }
    
  }
 
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
        // Delay hiding recent searches to allow for clicks
        setTimeout(() => setShowRecentSearches(false), 200);
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowRecentSearches(value.trim() !== '');
  };

  
  const handleSignOut = () => {
    setIsSigningOut(true);
    signOut(auth).then(() => {
      setUser(null);
      setShowProfileBox(false);
    }).catch((error) => {
      console.error("Sign out error", error);
    }).finally(() => {
      setIsSigningOut(false);
    });
  };

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setUser(user);
      }).catch((error) => {
        // Handle Errors here.
        console.error("Sign in error", error);
      });
  };
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        handleSearchBlur();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef, searchValue]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileBoxRef.current && !profileBoxRef.current.contains(event.target)) {
        setShowProfileBox(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileBoxRef]);


  useEffect(() => {
    // Load recent searches from localStorage when component mounts
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(storedSearches);
  }, []);

  const addRecentSearch = (search) => {
    const updatedSearches = [search, ...recentSearches.filter(s => s !== search)].slice(0, 10);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // const generateDummyResults = (searchQuery) => {
  //   const numberOfResults = 5; // You can adjust this number
  //   return Array(numberOfResults).fill().map((_, index) => ({
  //     thumbnail: `https://picsum.photos/seed/${searchQuery}${index}/360/202`,
  //     title: `${searchQuery} - Search Result Video ${index + 1}`,
  //     views: `${Math.floor(Math.random() * 1000)}K`,
  //     uploadDate: `${Math.floor(Math.random() * 12) + 1} months ago`,
  //     channelAvatar: `https://picsum.photos/seed/channel${index}/24/24`,
  //     channelName: `Channel ${index + 1}`,
  //     description: `This is a sample video description for "${searchQuery}". It can be up to two lines long before being truncated with an ellipsis...`
  //   }));
  // };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchValue.trim()) {
      addRecentSearch(searchValue.trim());
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setShowRecentSearches(false);
    }
  };

   const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };


  const handleClearSearch = () => {
    setSearchValue('');
    setShowRecentSearches(false);
  };

  const handleRecentSearchClick = (search) => {
    setSearchValue(search);
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setShowRecentSearches(false);
  };

   const filteredRecentSearches = recentSearches.filter(search => 
    search.toLowerCase().includes(searchValue.toLowerCase())
  );


  return (

    <div className="header">
      <div className="header__left">
        <MenuIcon className='header__menu' onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
        <Link to="/">
        <img
          className="header__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png"
          alt="YouTube Logo"
        />
        </Link>
      </div>
    
      <div className={`header__center ${isSearchFocused ? 'focused' : ''}`} ref={searchContainerRef}>
        <div className="header__searchContainer">
            <div className="header__searchIconSmall">
              <SearchIcon style={{ fontSize: 20, color: '#030303' }} />
            </div>
            {/* <form onSubmit={handleSearchSubmit}> */}
            <input 
              className="header__searchInput"
              placeholder="Search" 
              type="text" 
              onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            value={searchValue}
            />
              {searchValue && (
              <div className="header__searchClear" onClick={handleClearSearch}>
                <CloseIcon style={{ fontSize: 24, color: '#030303' }} />
              </div>
            )}
         
            {/* </form> */}
            {showRecentSearches && filteredRecentSearches.length > 0 && (
              <div className="header__recentSearches">
                {filteredRecentSearches.map((search, index) => (
                  <div key={index} className="header__recentSearchItem" onClick={() => handleRecentSearchClick(search)}>
                    <SearchIcon style={{ fontSize: 24, color: '#030303' }} />
                    <span>{search}</span>
                  </div>
                ))}
              </div>
            )}
         
        </div>
            <button type="button" className="header__searchButton" onClick={handleSearchSubmit}>
             <SearchIcon style={{ fontSize: 24 }} />
           </button>
     
        
      </div>
      

      <div className="header__icons">
        {user ? (
          <>
        <VideoCallIcon className="header__icon" />
        <NotificationsIcon className="header__icon" />
        <div className="header__profile" ref={profileBoxRef}>
          <Avatar 
            alt={user?.displayName} 
            src={user?.photoURL}
            sx={{ width: 32, height: 32 }}
            className="header__avatar"
            onClick={() => setShowProfileBox(!showProfileBox)}
          />
          {showProfileBox && (
            <div className="profile-box">
              <div className="profile-info-container">
                <Avatar 
                  alt={user?.displayName} 
                  src={user?.photoURL}
                  className="profile-avatar"
                />
                <div className="profile-content-box">
                  <div className="profile-name">{user?.displayName}</div>
                  <div className="profile-handle">@{user?.uid.slice(0, 8)}</div>
                  <div className="view-channel">View your channel</div>
                </div>
              </div>
              <div className="profile-item-container">
                <div className="profile-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="profile-icon" />
                  <span>Google Account</span>
                </div>
                <div className="profile-item">
                  <AccountCircleIcon className="profile-icon" />
                  <span>Switch account</span>
                  <ArrowForwardIosIcon  sx={{ width: 18, height: 18 }} className="arrow-icon" />
                </div>
                <div className="profile-item" onClick={handleSignOut}>
                    <ExitToAppIcon className="profile-icon" />
                    <span>Sign out</span>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      ) : (
        <>
        <div className="header__icon header__moreOptions">
          <MoreVertIcon />
        </div>
        <button className="header__signInButton" onClick={handleSignIn}>
          <AccountCircleIcon />
          <span>Sign in</span>
        </button>
      </>
      )}
      </div>
    </div>
  );
}

export default Header;