import React, { useState, useEffect } from 'react';
import StepCard from './StepCard';
import ProgressBar from './ProgressBar';
import TemperatureGauge from './TemperatureGauge';
import './TurkeySimulator.css';

const TurkeySimulator = ({ simulation, steps, socket, onStepComplete }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStepTimer, setCurrentStepTimer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - simulation.startTime) / 1000);
      setTimeElapsed(elapsed);
      
      // Calculate current step timer
      const currentStep = steps[simulation.currentStep];
      if (currentStep) {
        setCurrentStepTimer(Math.min(elapsed, currentStep.duration));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [simulation.startTime, simulation.currentStep, steps]);

  const currentStep = steps[simulation.currentStep];
  const progress = (simulation.currentStep / (steps.length - 1)) * 100;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'preparation': return '🔪';
      case 'baking': return '🔥';
      case 'finishing': return '✨';
      default: return '📋';
    }
  };

  const isStepComplete = () => {
    return currentStepTimer >= currentStep?.duration;
  };

  const isFinalStep = () => {
    return simulation.currentStep === steps.length - 1;
  };

  return (
    <div className="turkey-simulator">
      <div className="simulator-header">
        <h2 className={isFinalStep() ? 'final-step' : ''}>
          {getPhaseIcon(currentStep?.phase)} {currentStep?.title}
          {isFinalStep() && <span className="final-step-indicator"> - Almost Done! 🎉</span>}
        </h2>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-label">Total Time:</span>
            <span className="stat-value">{formatTime(timeElapsed)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Turkey Weight:</span>
            <span className="stat-value">{simulation.turkeyWeight} lbs</span>
          </div>
          <div className="stat">
            <span className="stat-label">Progress:</span>
            <span className="stat-value">{Math.round(progress)}%</span>
          </div>
        </div>

      </div>

      <ProgressBar 
        progress={progress} 
        currentStep={simulation.currentStep + 1}
        totalSteps={steps.length}
      />

      {!isFinalStep() ? (
        <div className="main-content">
          <div className="left-panel">
            {currentStep && (
              <StepCard
                step={currentStep}
                timeElapsed={currentStepTimer}
                isComplete={isStepComplete()}
                onComplete={() => onStepComplete(currentStep.id)}
              />
            )}
          </div>

          <div className="right-panel">
            <TemperatureGauge 
              currentTemp={simulation.currentTemperature}
              targetTemp={currentStep?.temperature}
              phase={currentStep?.phase}
            />
            
            <div className="upcoming-steps">
              <h3>Upcoming Steps</h3>
              <div className="steps-preview">
                {steps.slice(simulation.currentStep + 1, simulation.currentStep + 4).map((step, index) => (
                  <div key={step.id} className="preview-step">
                    <span className="step-number">{simulation.currentStep + index + 2}</span>
                    <span className="step-title">{step.title}</span>
                    <span className="step-duration">{formatTime(step.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="final-step-visual">
          <div className="resting-turkey">
            <div className="turkey-container">
              <div className="cooked-turkey-large">🦃</div>
              <div className="resting-sparkles">✨</div>
              <div className="resting-steam">💨</div>
            </div>
            <h3>Your Turkey is Resting...</h3>
            <div className="resting-timer">
              <span className="timer-text">Ready in: {formatTime(currentStep.duration - currentStepTimer)}</span>
              <div className="timer-bar">
                <div 
                  className="timer-fill" 
                  style={{ width: `${(currentStepTimer / currentStep.duration) * 100}%` }}
                />
              </div>
            </div>
            <p className="resting-description">
              The turkey is resting to allow the juices to redistribute throughout the meat, 
              ensuring maximum flavor and tenderness.
            </p>
          </div>
        </div>
      )}

      {simulation.currentStep === steps.length - 1 && isStepComplete() && (
        <div className="completion-banner">
          <div className="completion-content">
            <div className="turkey-image">
              <div className="cooked-turkey">🦃</div>
              <div className="sparkles">✨</div>
              <div className="steam">💨</div>
            </div>
            <h2>🎉 Congratulations! Your Turkey is Perfect!</h2>
            <p>You've successfully completed all 10 steps in just 2 minutes!</p>
            <div className="completion-stats">
              <div className="stat-item">
                <span className="stat-number">165°F</span>
                <span className="stat-label">Perfect Temperature</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{simulation.turkeyWeight} lbs</span>
                <span className="stat-label">Turkey Weight</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2 min</span>
                <span className="stat-label">Simulation Time</span>
              </div>
            </div>
            <div className="completion-message">
              <h3>🍽️ Your Turkey is Ready to Serve!</h3>
              <p>In real life, this would have taken about 6+ hours. Time to gather the family and enjoy your perfectly cooked Thanksgiving feast!</p>
            </div>
            <button className="new-simulation-btn" onClick={() => window.location.reload()}>
              🦃 Cook Another Turkey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurkeySimulator;