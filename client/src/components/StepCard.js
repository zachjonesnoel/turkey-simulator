import React from 'react';
import './StepCard.css';

const StepCard = ({ step, timeElapsed, isComplete, onComplete }) => {
  const progress = Math.min((timeElapsed / step.duration) * 100, 100);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'preparation': return '#4CAF50';
      case 'baking': return '#FF9800';
      case 'finishing': return '#9C27B0';
      default: return '#2196F3';
    }
  };

  return (
    <div className="step-card">
      <div className="step-header">
        <div className="step-phase" style={{ backgroundColor: getPhaseColor(step.phase) }}>
          {step.phase.toUpperCase()}
        </div>
        <h3>{step.title}</h3>
      </div>

      <div className="step-description">
        <p>{step.description}</p>
      </div>

      <div className="step-instructions">
        <h4>Instructions:</h4>
        <p>{step.instructions}</p>
      </div>

      <div className="step-progress">
        <div className="progress-header">
          <span>Progress</span>
          <span>{formatTime(timeElapsed)} / {formatTime(step.duration)}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progress}%`,
              backgroundColor: getPhaseColor(step.phase)
            }}
          />
        </div>
        <div className="progress-percentage">{Math.round(progress)}%</div>
        {step.realDuration && (
          <div className="real-duration">
            <small>🕐 Real cooking time: {step.realDuration}</small>
          </div>
        )}
      </div>

      {step.phase === 'baking' && (
        <div className="temperature-info">
          <div className="temp-display">
            <span className="temp-label">Target Temperature:</span>
            <span className="temp-value">{step.temperature}°F</span>
          </div>
        </div>
      )}

      <div className="step-actions">
        {isComplete ? (
          <button className="complete-button" onClick={onComplete}>
            ✓ Mark Complete & Continue
          </button>
        ) : (
          <div className="timer-display">
            <span>⏱️ {formatTime(step.duration - timeElapsed)} remaining</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepCard;