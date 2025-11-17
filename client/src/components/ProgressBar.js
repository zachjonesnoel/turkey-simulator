import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, currentStep, totalSteps }) => {
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
        <div className="progress-steps">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`progress-step ${index < currentStep ? 'completed' : ''} ${index === currentStep - 1 ? 'current' : ''}`}
              style={{ left: `${(index / (totalSteps - 1)) * 100}%` }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;