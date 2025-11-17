import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import TurkeySimulator from './components/TurkeySimulator';
import './App.css';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8080/api';

function App() {
  const [socket, setSocket] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [steps, setSteps] = useState([]);
  const [turkeyWeight, setTurkeyWeight] = useState(12);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:8080');
    setSocket(newSocket);

    // Fetch turkey steps
    fetchSteps();

    return () => newSocket.close();
  }, []);

  const fetchSteps = async () => {
    try {
      const response = await axios.get(`${API_BASE}/steps`);
      setSteps(response.data);
    } catch (error) {
      console.error('Error fetching steps:', error);
    }
  };

  const startSimulation = async () => {
    try {
      const response = await axios.post(`${API_BASE}/simulation/start`, {
        weight: turkeyWeight
      });
      setSimulation(response.data);
      
      if (socket) {
        socket.emit('joinSimulation', response.data.id);
        socket.on('simulationUpdate', (updatedSimulation) => {
          setSimulation(updatedSimulation);
        });
      }
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🦃 Thanksgiving Turkey Baking Simulator</h1>
        <p>Master the art of perfect turkey preparation and baking!</p>
        <div className="simulation-notice">
          ⚡ Fast 2-minute simulation - Experience the full process in real-time!
        </div>
      </header>
      
      <main className="App-main">
        {!simulation ? (
          <div className="start-screen">
            <h2>Ready to Bake Your Turkey?</h2>
            <div className="weight-selector">
              <label htmlFor="weight">Turkey Weight (lbs):</label>
              <input
                id="weight"
                type="number"
                min="8"
                max="25"
                value={turkeyWeight}
                onChange={(e) => setTurkeyWeight(Number(e.target.value))}
              />
            </div>
            <button className="start-button" onClick={startSimulation}>
              Start Turkey Preparation
            </button>
          </div>
        ) : (
          <TurkeySimulator
            simulation={simulation}
            steps={steps}
            socket={socket}
            onStepComplete={(stepId) => {
              axios.post(`${API_BASE}/simulation/${simulation.id}/next-step`);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
