import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import './ExpandedSidebar.css';
import Sidebar from './Sidebar';

function ExpandedSidebar({ onClose, isOpen }) {
  return (
    <div className={`expanded-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="expanded-sidebar__header">
        <MenuIcon className='header__menu' onClick={onClose} style={{ cursor: 'pointer' }} />
        <img
          className="header__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png"
          alt="YouTube Logo"
        />
      </div>
      <div className="expanded-sidebar__content">
        <Sidebar collapsed={false} />
      </div>
    </div>
  );
}

export default ExpandedSidebar;