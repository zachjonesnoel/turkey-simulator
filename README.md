# 🦃 Thanksgiving Turkey Baking Simulator

A full-stack web application that simulates the complete process of preparing and baking a Thanksgiving turkey with step-by-step guidance, real-time progress tracking, and temperature monitoring.

## Features

- **Step-by-Step Guidance**: 10 detailed steps from thawing to serving
- **Real-Time Progress Tracking**: Live updates with Socket.IO
- **Temperature Monitoring**: Visual temperature gauge with target temperatures
- **Interactive Timeline**: Progress bar with step indicators
- **Responsive Design**: Works on desktop and mobile devices
- **Fast 2-Minute Simulation**: Complete turkey cooking process compressed into 2 minutes
- **Real vs Simulated Time**: Shows both simulation time and actual cooking durations

## Tech Stack

### Frontend
- React 18
- Socket.IO Client
- Axios for API calls
- CSS3 with modern styling

### Backend
- Node.js with Express
- Socket.IO for real-time updates
- RESTful API design

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start the development servers**:
   ```bash
   npm run dev
   ```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Manual Setup (Alternative)

If you prefer to start servers individually:

1. **Start the backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend** (in a new terminal):
   ```bash
   cd client
   npm install
   npm start
   ```

## How to Use

1. **Enter Turkey Weight**: Start by entering your turkey's weight (8-25 lbs)
2. **Follow the Steps**: The simulator guides you through 10 detailed steps:
   - Thawing (24 hours)
   - Preparation steps (removing giblets, seasoning, etc.)
   - Baking process with temperature monitoring
   - Resting period before serving

3. **Monitor Progress**: 
   - Watch the progress bar advance through each step
   - Monitor temperature changes in real-time
   - Get timing estimates for each phase

4. **Complete Steps**: Mark each step as complete when finished to advance to the next phase

## Application Structure

```
turkey-baking-simulator/
├── server/                 # Backend Express server
│   ├── index.js           # Main server file with API routes
│   └── package.json       # Backend dependencies
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── TurkeySimulator.js
│   │   │   ├── StepCard.js
│   │   │   ├── ProgressBar.js
│   │   │   ├── TemperatureGauge.js
│   │   │   └── *.css      # Component styles
│   │   ├── App.js         # Main App component
│   │   └── App.css        # Global styles
│   └── package.json       # Frontend dependencies
├── package.json           # Root package with scripts
└── README.md              # This file
```

## API Endpoints

- `GET /api/steps` - Get all turkey preparation steps
- `POST /api/simulation/start` - Start a new simulation
- `GET /api/simulation/:id` - Get simulation status
- `POST /api/simulation/:id/next-step` - Advance to next step

## Socket.IO Events

- `joinSimulation` - Join a simulation room
- `simulationUpdate` - Receive real-time simulation updates

## Turkey Preparation Steps (2-Minute Simulation)

1. **Thaw the Turkey** (8 sec / 24 hours real)
2. **Remove Giblets** (5 sec / 5 minutes real)
3. **Rinse and Pat Dry** (7 sec / 10 minutes real)
4. **Season the Turkey** (10 sec / 15 minutes real)
5. **Stuff (Optional)** (8 sec / 10 minutes real)
6. **Preheat Oven** (12 sec / 15 minutes real)
7. **Initial Baking** (25 sec / 2 hours real)
8. **Baste Turkey** (6 sec / 5 minutes real)
9. **Continue Baking** (22 sec / 1.5 hours real)
10. **Rest the Turkey** (17 sec / 30 minutes real)

**Total Simulation Time**: 2 minutes (120 seconds)
**Total Real Cooking Time**: ~6+ hours

## Customization

You can easily customize the application by:

- Modifying the `turkeySteps` array in `server/index.js` to add/change steps
- Adjusting timing and temperatures for different cooking methods
- Adding new features like recipe suggestions or side dish timers
- Styling changes in the CSS files

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning or personal use.

---

Happy Thanksgiving! 🦃🍂