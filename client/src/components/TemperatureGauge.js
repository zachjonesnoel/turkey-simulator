import React from 'react';
import './TemperatureGauge.css';

const TemperatureGauge = ({ currentTemp, targetTemp, phase }) => {
  const maxTemp = 400;
  const percentage = (currentTemp / maxTemp) * 100;
  
  const getTemperatureColor = (temp) => {
    if (temp < 100) return '#2196F3'; // Blue - cold
    if (temp < 200) return '#4CAF50'; // Green - warming
    if (temp < 300) return '#FF9800'; // Orange - hot
    return '#F44336'; // Red - very hot
  };

  const getTemperatureStatus = () => {
    if (phase === 'preparation') return 'Refrigerated';
    if (phase === 'baking') {
      if (currentTemp < targetTemp - 10) return 'Heating Up';
      if (currentTemp >= targetTemp - 10 && currentTemp <= targetTemp + 5) return 'Perfect Temperature';
      return 'Too Hot';
    }
    if (phase === 'finishing') return 'Resting';
    return 'Ready';
  };

  return (
    <div className="temperature-gauge">
      <h3>🌡️ Temperature Monitor</h3>
      
      <div className="gauge-container">
        <div className="gauge-background">
          <div 
            className="gauge-fill" 
            style={{ 
              height: `${percentage}%`,
              backgroundColor: getTemperatureColor(currentTemp)
            }}
          />
          {targetTemp && (
            <div 
              className="target-line" 
              style={{ bottom: `${(targetTemp / maxTemp) * 100}%` }}
            >
              <span className="target-label">Target: {targetTemp}°F</span>
            </div>
          )}
        </div>
        
        <div className="gauge-scale">
          <div className="scale-mark" style={{ bottom: '0%' }}>0°F</div>
          <div className="scale-mark" style={{ bottom: '25%' }}>100°F</div>
          <div className="scale-mark" style={{ bottom: '50%' }}>200°F</div>
          <div className="scale-mark" style={{ bottom: '75%' }}>300°F</div>
          <div className="scale-mark" style={{ bottom: '100%' }}>400°F</div>
        </div>
      </div>

      <div className="temperature-display">
        <div className="current-temp">
          <span className="temp-value" style={{ color: getTemperatureColor(currentTemp) }}>
            {Math.round(currentTemp)}°F
          </span>
          <span className="temp-status">{getTemperatureStatus()}</span>
        </div>
        
        {targetTemp && (
          <div className="target-temp">
            <span className="target-label">Target: {targetTemp}°F</span>
          </div>
        )}
      </div>

      <div className="temperature-tips">
        <h4>💡 Temperature Tips</h4>
        {phase === 'preparation' && (
          <p>Keep turkey refrigerated at 40°F or below until ready to cook.</p>
        )}
        {phase === 'baking' && (
          <p>Maintain oven at 325°F. Turkey is done when internal temp reaches 165°F.</p>
        )}
        {phase === 'finishing' && (
          <p>Let turkey rest to allow juices to redistribute throughout the meat.</p>
        )}
      </div>
    </div>
  );
};

export default TemperatureGauge;