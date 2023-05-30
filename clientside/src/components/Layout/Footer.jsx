import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer'>
      <h3 className='text-center'>LIFE IS BETTER WITH TROPICAL FISH </h3>
      <p className="text-center mt-3">
        <Link to="/about">About</Link>|
        <Link to="/Contact">Contact</Link>|
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
  )
}

export default Footer
