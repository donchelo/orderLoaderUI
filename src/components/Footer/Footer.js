import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-text">
          Powered by{' '}
          <a 
            href="https://www.ai4u.com.co" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            www.ai4u.com.co
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
