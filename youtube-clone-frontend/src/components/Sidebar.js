import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { UserContext } from '../context/UserContext';
import { auth, provider } from '../firebase';
import './Sidebar.css';

import {
  Home as HomeIcon,
  Explore as ExploreIcon,
  Subscriptions as SubscriptionsIcon,
  VideoLibrary as VideoLibraryIcon,
  History as HistoryIcon,
  WatchLater as WatchLaterIcon,
  ThumbUpAltOutlined as ThumbUpAltOutlinedIcon,
  ExpandMoreOutlined as ExpandMoreOutlinedIcon,
  AccountCircle as AccountCircleIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Whatshot as WhatshotIcon,
  MusicNote as MusicNoteIcon,
  Movie as MovieIcon,
  SportsEsports as SportsEsportsIcon,
  Announcement as AnnouncementIcon,
  SportsSoccer as SportsSoccerIcon,
  Face as FaceIcon,
  Mic as MicIcon,
  Paid as PaidIcon,
  VideoSettings as VideoSettingsIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  SmartToy as SmartToyIcon,
  Settings as SettingsIcon,
  Flag as FlagIcon,
  HelpOutline as HelpOutlineIcon,
  Feedback as FeedbackIcon,
  LiveTv as LiveTvIcon
} from '@mui/icons-material';

// Rest of the component code...

function Sidebar({ collapsed }) {
    const { user, setUser } = useContext(UserContext);
    const [isHovered, setIsHovered] = useState(false);
    const [popularChannels, setPopularChannels] = useState([
        { id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw', name: 'PewDiePie', avatar: 'https://yt3.ggpht.com/ytc/AAUvwnhEWQNuA-mjqxLqnxia6OrJooWWGnyn8KCw3yNbriQ=s88-c-k-c0x00ffffff-no-rj' },
        { id: 'UCX6OQ3DkcsbYNE6H8uQQuVA', name: 'MrBeast', avatar: 'https://yt3.ggpht.com/ytc/AAUvwnhyQxJ3Yv0aeKcCXYmYqCeYhTJrI6Uc3xYlzPG9Yw=s88-c-k-c0x00ffffff-no-rj' },
        { id: 'UCq-Fj5jknLsUf-MWSy4_brA', name: 'T-Series', avatar: 'https://yt3.ggpht.com/ytc/AAUvwnjZj9Ij3NzqX0DxXKPjvuHUzS4VTvZIXtQeHCHQVg=s88-c-k-c0x00ffffff-no-rj' },
        { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'Marques Brownlee', avatar: 'https://yt3.ggpht.com/ytc/AAUvwngW9TQgw7E7NqS3Qzd3Up3tjUzkpvMXPWAhYf3LaQ=s88-c-k-c0x00ffffff-no-rj' },
        { id: 'UCLXo7UDZvByw2ixzpQCufnA', name: 'Vox', avatar: 'https://yt3.ggpht.com/ytc/AAUvwniUFtxq0uVjEhiXKuLLGZzBf_Eu_7JEPlPtWfnSZA=s88-c-k-c0x00ffffff-no-rj' },
    ]);


    useEffect(() => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        if (isHovered) {
          mainContent.style.overflowY = 'hidden';
        } else {
          mainContent.style.overflowY = 'auto';
        }
      }
    }, [isHovered]);

    const signIn = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
          setUser(result.user);
        })
        .catch((error) => alert(error.message));
    };

    
  return (
    <>
    <div className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} `}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarRow Icon={HomeIcon} title="Home" />
      <SidebarRow Icon={ExploreIcon} title="Short" />
      <SidebarRow Icon={SubscriptionsIcon} title="Subscriptions" />
      <SidebarRow Icon={LiveTvIcon} title="You" />
      {!collapsed && (
       <>
       <hr />
       <div >
         <div className="sidebarRow sidebarRow--section">
           <h4 className="sidebarRow__title mr-12">You</h4>
           <ArrowForwardIosIcon  sx={{ fontSize: 14 }} />
         </div>
         <SidebarRow Icon={AccountCircleIcon} title="Your channel" />
         <SidebarRow Icon={HistoryIcon} title="History" />
         <SidebarRow Icon={VideoLibraryIcon} title="Your videos" />
         <SidebarRow Icon={WatchLaterIcon} title="Watch Later" />
         <SidebarRow Icon={ThumbUpAltOutlinedIcon} title="Liked videos" />
         <SidebarRow Icon={ExpandMoreOutlinedIcon} title="Show more" />
       </div>
       <hr />
       <div >
       {!user ? (
          <>
            <div className="sidebar__signIn">
              <p>Sign in to like videos, comment, and subscribe.</p>
              <button className="sidebar__signInButton" onClick={signIn}>
                <AccountCircleIcon />
                <span>Sign In</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="sidebarRow sidebarRow--section">
              <h4 className="sidebarRow__title">Subscriptions</h4>
            </div>
            {popularChannels.map((channel) => (
           <Link to={`/channel/${channel.id}`} key={channel.id} className="sidebarRow">
             <img src={channel.avatar} alt={channel.name} className="sidebarRow__avatar" />
             <span className="sidebarRow__body">{channel.name}</span>
           </Link>
         ))}
          </>
        )}
       </div>
       <hr />

       <div>
        <div className="sidebarRow sidebarRow--section">
         <h4 className="sidebarRow__title">Explore</h4>
        </div>
            <SidebarRow Icon={WhatshotIcon} title="Trending" />
            <SidebarRow Icon={MusicNoteIcon} title="Music" />
            <SidebarRow Icon={MovieIcon} title="Movies" />
            <SidebarRow Icon={SportsEsportsIcon} title="Gaming" />
            <SidebarRow Icon={AnnouncementIcon} title="News" />
            <SidebarRow Icon={SportsSoccerIcon} title="Sports" />
            <SidebarRow Icon={FaceIcon} title="Fashion & Beauty" />
            <SidebarRow Icon={MicIcon} title="Podcasts" />
       </div>
       <hr />

       <div>
        <div className="sidebarRow sidebarRow--section">
         <h4 className="sidebarRow__title">More from YouTube</h4>
        </div>
            <SidebarRow Icon={PaidIcon} title="YouTube Premium" />
            <SidebarRow Icon={VideoSettingsIcon} title="YouTube Studio" />
            <SidebarRow Icon={PlayCircleOutlineIcon} title="YouTube Music" />
            <SidebarRow Icon={SmartToyIcon} title="YouTube Kids" />  
       </div>
       <hr />

       <div>
            <SidebarRow Icon={SettingsIcon} title="Setting" />
            <SidebarRow Icon={FlagIcon} title="Report history" />
            <SidebarRow Icon={HelpOutlineIcon} title="Help" />
            <SidebarRow Icon={FeedbackIcon} title="Send feedback" />
       </div>
       <hr />
       <div className='footer'>
        <div className='footer__links'>
            <div className='footer__links-section'>
            <Link to="/">About</Link>
            <Link to="/">Press</Link>
            <Link to="/">Copyright</Link>
            <br/>
            <Link to="/">Contact us</Link>
            <Link to="/">Creator</Link>
            <br/>

            <Link to="/">Advertise</Link>
            <Link to="/">Developers</Link>

            </div>
            <div className='footer__links-section'>
            <Link to="/">Terms</Link>
            <Link to="/">Privacy</Link>
            <Link to="/">Policy & Safety</Link>
            <br/>
            <Link to="/">How YouTube works</Link>
             <br/>
            <Link to="/">Test</Link>    
            <Link to="/">New </Link>    
            <Link to="/">Features</Link>    
            </div>
        </div>
        <p className='footer__copyright'>© 2024 Google LLC</p>

       </div>
     </>
      )}
    </div>
    
    </>
  );
}

function SidebarRow({ selected, Icon, title }) {
  return (
    <Link to="/" className={`sidebarRow ${selected && "selected"}`}>
      <Icon className="sidebarRow__icon" />
      <h2 className="sidebarRow__body">{title}</h2>
    </Link>
  );
}

export default Sidebar;