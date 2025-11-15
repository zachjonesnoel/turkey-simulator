const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Turkey preparation and baking steps - 2 minute simulation (120 seconds total)
const turkeySteps = [
  {
    id: 1,
    phase: 'preparation',
    title: 'Thaw the Turkey',
    description: 'Remove turkey from freezer and thaw in refrigerator',
    duration: 8, // 8 seconds (simulated 24 hours)
    temperature: 40,
    instructions: 'Place turkey in refrigerator 24 hours before cooking. Allow 4-5 hours per pound for thawing.',
    realDuration: '24 hours'
  },
  {
    id: 2,
    phase: 'preparation',
    title: 'Remove Giblets',
    description: 'Remove neck and giblets from turkey cavity',
    duration: 5, // 5 seconds
    temperature: 40,
    instructions: 'Check both the main cavity and neck cavity. Save giblets for gravy if desired.',
    realDuration: '5 minutes'
  },
  {
    id: 3,
    phase: 'preparation',
    title: 'Rinse and Pat Dry',
    description: 'Rinse turkey inside and out, then pat completely dry',
    duration: 7, // 7 seconds
    temperature: 40,
    instructions: 'Use cold water to rinse. Pat dry with paper towels inside and out.',
    realDuration: '10 minutes'
  },
  {
    id: 4,
    phase: 'preparation',
    title: 'Season the Turkey',
    description: 'Apply seasoning inside cavity and under/over skin',
    duration: 10, // 10 seconds
    temperature: 40,
    instructions: 'Season cavity with salt and pepper. Gently loosen skin and season under skin. Rub butter or oil on skin.',
    realDuration: '15 minutes'
  },
  {
    id: 5,
    phase: 'preparation',
    title: 'Stuff (Optional)',
    description: 'Add stuffing to turkey cavity if desired',
    duration: 8, // 8 seconds
    temperature: 40,
    instructions: 'Fill cavity loosely with stuffing. Do not pack tightly. Stuffing should reach 165°F when done.',
    realDuration: '10 minutes'
  },
  {
    id: 6,
    phase: 'baking',
    title: 'Preheat Oven',
    description: 'Preheat oven to 325°F (165°C)',
    duration: 12, // 12 seconds
    temperature: 325,
    instructions: 'Ensure oven rack is in lower third of oven. Remove any extra racks.',
    realDuration: '15 minutes'
  },
  {
    id: 7,
    phase: 'baking',
    title: 'Initial Baking',
    description: 'Place turkey in oven and begin roasting',
    duration: 25, // 25 seconds (simulated 2 hours)
    temperature: 325,
    instructions: 'Place turkey breast-side up on rack in roasting pan. Tent with foil if browning too quickly.',
    realDuration: '2 hours'
  },
  {
    id: 8,
    phase: 'baking',
    title: 'Baste Turkey',
    description: 'Baste turkey with pan juices',
    duration: 6, // 6 seconds
    temperature: 325,
    instructions: 'Remove from oven briefly. Baste with pan juices using baster or spoon. Work quickly to maintain oven temperature.',
    realDuration: '5 minutes'
  },
  {
    id: 9,
    phase: 'baking',
    title: 'Continue Baking',
    description: 'Continue roasting until internal temperature reaches 165°F',
    duration: 22, // 22 seconds (simulated 1.5 hours)
    temperature: 325,
    instructions: 'Check temperature in thickest part of thigh. Turkey is done when it reaches 165°F (74°C).',
    realDuration: '1.5 hours'
  },
  {
    id: 10,
    phase: 'finishing',
    title: 'Rest the Turkey',
    description: 'Let turkey rest before carving',
    duration: 17, // 17 seconds (simulated 30 minutes)
    temperature: 165,
    instructions: 'Remove from oven and tent with foil. Let rest 20-30 minutes before carving. This allows juices to redistribute.',
    realDuration: '30 minutes'
  }
];

// Store active simulations
const activeSimulations = new Map();

// API Routes
app.get('/api/steps', (req, res) => {
  res.json(turkeySteps);
});

app.post('/api/simulation/start', (req, res) => {
  const simulationId = Date.now().toString();
  const simulation = {
    id: simulationId,
    currentStep: 0,
    startTime: Date.now(),
    isActive: true,
    turkeyWeight: req.body.weight || 12, // Default 12 lbs
    currentTemperature: 40
  };
  
  activeSimulations.set(simulationId, simulation);
  res.json(simulation);
});

app.get('/api/simulation/:id', (req, res) => {
  const simulation = activeSimulations.get(req.params.id);
  if (!simulation) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  res.json(simulation);
});

app.post('/api/simulation/:id/next-step', (req, res) => {
  const simulation = activeSimulations.get(req.params.id);
  if (!simulation) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  
  if (simulation.currentStep < turkeySteps.length - 1) {
    simulation.currentStep++;
    const currentStep = turkeySteps[simulation.currentStep];
    simulation.currentTemperature = currentStep.temperature;
  }
  
  activeSimulations.set(req.params.id, simulation);
  io.emit('simulationUpdate', simulation);
  res.json(simulation);
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('joinSimulation', (simulationId) => {
    socket.join(simulationId);
    console.log(`Client ${socket.id} joined simulation ${simulationId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simulate temperature changes and timing - faster updates for 2-minute simulation
setInterval(() => {
  activeSimulations.forEach((simulation, id) => {
    if (simulation.isActive) {
      const currentStep = turkeySteps[simulation.currentStep];
      const elapsed = (Date.now() - simulation.startTime) / 1000;
      
      // Simulate gradual temperature changes during baking
      if (currentStep.phase === 'baking') {
        if (currentStep.id === 6) {
          // Preheat oven - temperature rises quickly
          const targetTemp = 325;
          if (simulation.currentTemperature < targetTemp) {
            simulation.currentTemperature = Math.min(
              targetTemp,
              simulation.currentTemperature + 15 // Faster heating for simulation
            );
          }
        } else if (currentStep.id >= 7) {
          // During baking - turkey internal temperature rises
          const targetTemp = currentStep.id === 9 ? 165 : Math.min(165, simulation.currentTemperature + 2);
          if (simulation.currentTemperature < 165) {
            simulation.currentTemperature = Math.min(
              165,
              simulation.currentTemperature + 1.5 // Gradual internal temp rise
            );
          }
        }
      }
      
      io.to(id).emit('simulationUpdate', simulation);
    }
  });
}, 1000); // Update every 1 second for smoother simulation

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Turkey Baking Simulator server running on port ${PORT}`);
});