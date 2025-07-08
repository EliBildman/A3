# A3 - Smart Home Automation System

A3 is a Node.js-based smart home automation system that uses a modular architecture to control and monitor IoT devices. The system is built around a "head" concept where each module handles specific device types and operations.

## Device Libraries
(A3Device)[https://github.com/EliBildman/A3Device] for ESP8266

## Core Components

### Heads (Modules)

Each head module provides functionality for specific device types:

- **`motion.js`** - Handles motion sensor events and timing
- **`tp_plug.js`** - Controls TP-Link smart plugs
- **`thermo.js`** - Temperature sensor data processing
- **`keypad.js`** - Keypad input handling
- **`speaker.js`** - Audio output control
- **`ambient.js`** - Ambient sensor readings
- **`time.js`** - Time-based triggers and scheduling
- **`math.js`** - Mathematical operations and calculations
- **`string.js`** - String manipulation and text processing
- **`func.js`** - Function execution utilities
- **`utils.js`** - General utilities like caching and conditionals

### Managers

The system uses several managers to coordinate operations:

- **`head-manager.js`** - Registers and executes head modules
- **`socket-manager.js`** - Manages WebSocket connections
- **`event-manager.js`** - Routes events between components
- **`action-manager.js`** - Executes actions and commands
- **`api-manager.js`** - Handles API endpoint logic
- **`stats-manager.js`** - Collects system statistics
- **`tcp-manager.js`** - Manages TCP device connections

### Routes

HTTP routing is handled by specialized routers:

- **`action-router.js`** - Routes action execution requests
- **`event-router.js`** - Routes event handling requests
- **`api-router.js`** - General API endpoints
- **`tcp-router.js`** - TCP communication routing

## Getting Started

### Prerequisites

- Node.js 16 or higher
- MongoDB instance
- TP-Link smart plugs (optional)
- Motion sensors (optional)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd A3
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run in development mode:

```bash
npm run dev
```

5. Run in production mode:

```bash
npm start
```

## Docker Deployment

The project includes Docker support for easy deployment:

```bash
# Build for x86_64 systems
npm run docker_build

# Build for Raspberry Pi (ARM)
npm run docker_build_pi

# Run the container
docker run -p 3005:3005 -p 3010:3010 elibildman/a3:latest
```

## API Endpoints

### HTTP Server (Port 3005)

- `GET /` - Main web interface
- `GET /constants` - System constants and configuration
- `POST /actions/*` - Execute device actions
- `POST /events/*` - Handle device events
- `GET /api/*` - General API endpoints

### WebSocket Server

Provides real-time communication for device events and system updates.

### TCP Server (Port 3010)

Handles direct communication with sensors and actuators.

## Configuration

### Environment Variables

- `STAGE` - Environment stage (`dev` or `release`)
- `CREDS_FILE` - SSL credentials file path
- `DB_NAME` - MongoDB database name

### SSL Configuration

Place SSL certificates in the `ssl/` directory for production deployments.

## Logging

The system uses Winston for logging with multiple transport options:

- **MongoDB Transport** - Stores logs in the database
- **Socket Transport** - Streams logs in real-time
- **Console Transport** - Development console output

Logs are organized by component:

- `system-logger.js` - System-wide events
- `head-logger.js` - Head module events
- `manager-logger.js` - Manager events

## Device Integration

### TP-Link Smart Plugs

The system automatically discovers TP-Link smart plugs on the network.

Available actions:

- `on` - Turn plug on
- `off` - Turn plug off
- `store` - Store current state
- `restore` - Restore stored state

### Motion Sensors

Handles motion sensor events through TCP connections.

Events:

- `onActive` - Motion detected
- `onInactive` - Motion stopped

Actions:

- `inactiveTime` - Get time since last motion

## Usage Examples

### Basic Action Execution

```javascript
// Turn on a smart plug
POST /actions/tp_plug/on
{
  "name": "living_room_lamp"
}
```

### Event Handling

```javascript
// Listen for motion events
POST /events/motion/onActive
{
  "sensor_name": "front_door"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue on the GitHub repository.

---

**A3** - Smart home automation made simple and modular.
