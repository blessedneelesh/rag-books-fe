import React from 'react';
import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className={`loading-spinner ${size} ${color}`}>
      <div className="spinner-ring"></div>
    </div>
  );
};

// PropTypes validation
LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'white'])
};

LoadingSpinner.defaultProps = {
  size: 'medium',
  color: 'primary'
};

export default LoadingSpinner;