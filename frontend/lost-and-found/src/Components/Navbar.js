// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FoundItemForm from '../Pages/FoundItemForm/FoundItemForm';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(null); // Track the hovered item
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [resetVariable, setResetVariable] = useState(false);
  const currentUserName = localStorage.getItem('username');
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location = '/login';
  };

  const openForm = () => {
    setIsFormOpen(true);
    setResetVariable(false)

  };

  const closeForm = () => {
    setIsFormOpen(false);
    setResetVariable(true)

  };

  const navbarStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between', // Center items in the navbar
  };

  const navListStyle = {
    listStyle: 'none',
    display: 'flex',
    margin: '0',
    padding: '0',
    alignItems: "center",
  };

  const navItemStyle = {
    marginRight: '20px',
    height: '24px'
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  };

  const logoutButtonStyle = {
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#35ac65'
  };

  const highlightStyle = {
    color: '#35ac65',
    transition: 'color 0.3s ease-in-out',
    cursor: 'pointer'

  };
  const logoutHighlightStyle = {

    color: '#333',
    transition: 'color 0.3s ease-in-out',
    cursor: 'pointer'

  };

  return (
    <nav style={navbarStyle}>
      <ul style={navListStyle}>
        <li style={navItemStyle}>
          <Link
            to="/home"
            style={isHovered === 'home' ? { ...navLinkStyle, ...highlightStyle } : navLinkStyle}
            onClick={() => setIsHovered('home')}
            // onMouseLeave={() => setIsHovered(null)}
          >
            Home
          </Link>
        </li>

        <li style={navItemStyle}>
          <Link
            to="/lost-catalogue"
            style={isHovered === 'lost-catalogue' ? { ...navLinkStyle, ...highlightStyle } : navLinkStyle}
            onClick={() => setIsHovered('lost-catalogue')}
            // onMouseLeave={() => setIsHovered(null)}
          >
            Lost Catalogue
          </Link>
        </li>
        <li style={navItemStyle}>
          <Link
            to="/lost-form"
            style={isHovered === 'lost-form' ? { ...navLinkStyle, ...highlightStyle } : navLinkStyle}
            onClick={() => setIsHovered('lost-form')}
            // onMouseLeave={() => setIsHovered(null)}
          >
            Report Lost Item
          </Link>
        </li>
        <li style={navItemStyle}>
          <p
        
            onClick={() => {
            setIsHovered('found-form')
            openForm()
          }}
            style={isHovered === 'found-form' ? { ...navLinkStyle, ...highlightStyle } : navLinkStyle}
            // onMouseLeave={() => setIsHovered(null)}
          >
            Report Found Item
          </p>
        </li>
        <li style={navItemStyle}>
          <Link
            to="/chat"
            style={isHovered === 'chat' ? { ...navLinkStyle, ...highlightStyle } : navLinkStyle}
            onClick={() => setIsHovered('chat')}
            // onMouseLeave={() => setIsHovered(null)}
          >
            Chat
          </Link>
        </li>
        <li style={navItemStyle}>
          <Link
            to="/reward"
            style={isHovered === 'reward' ? { ...navLinkStyle, ...highlightStyle } : navLinkStyle}
            onClick={() => setIsHovered('reward')}
            // onMouseLeave={() => setIsHovered(null)}
          >
            Rewards
          </Link>
        </li>
      </ul>
      <div style={{display:"flex",alignItems:"center"}}>
      <p style={{marginTop:"10px",marginBottom:"10px",marginRight:"5px", fontWeight:"600"}}>Welcome</p>
      <p style={{marginTop:"10px",marginBottom:"10px",marginRight:"10px",fontWeight:"600",color:"#35ac65"}}>{currentUserName}!</p>
      <button
        onClick={handleLogout}
        style={isHovered === 'logout' ? { ...logoutButtonStyle, ...logoutHighlightStyle } : logoutButtonStyle}
        onMouseEnter={() => setIsHovered('logout')}
        // onMouseLeave={() => setIsHovered(null)}
      >
        Logout
      </button>
      </div>
      <FoundItemForm isOpen={isFormOpen} onRequestClose={closeForm} resetVariable={resetVariable} />

    </nav>
  );
};

export default Navbar;
