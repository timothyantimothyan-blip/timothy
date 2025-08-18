/**
 * Interir - A Standalone JavaScript Program
 * A simple interactive interior design visualization tool
 */

class InterirApp {
    constructor() {
        this.rooms = [];
        this.currentRoom = null;
        this.furniture = [];
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
    }

    init() {
        console.log('🏠 Interir - Interior Design Visualizer');
        console.log('=====================================');
        
        this.createInterface();
        this.setupEventListeners();
        this.generateSampleData();
        
        this.isRunning = true;
        this.mainLoop();
    }

    createInterface() {
        // Create a simple text-based interface for the standalone version
        console.log('\nAvailable Commands:');
        console.log('1. add-room [name] [width] [height] - Add a new room');
        console.log('2. list-rooms - Show all rooms');
        console.log('3. select-room [index] - Select a room to work with');
        console.log('4. add-furniture [type] [x] [y] - Add furniture to current room');
        console.log('5. list-furniture - Show furniture in current room');
        console.log('6. visualize - Show ASCII visualization');
        console.log('7. help - Show this help');
        console.log('8. exit - Exit the program\n');
    }

    setupEventListeners() {
        // In a standalone JS file, we'll use stdin for input
        if (typeof process !== 'undefined' && process.stdin) {
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.setPrompt('interir> ');
            rl.prompt();

            rl.on('line', (input) => {
                this.handleCommand(input.trim());
                rl.prompt();
            });

            rl.on('close', () => {
                console.log('\n👋 Goodbye from Interir!');
                process.exit(0);
            });
        }
    }

    handleCommand(input) {
        const parts = input.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        switch (command) {
            case 'add-room':
                this.addRoom(args[0], parseInt(args[1]), parseInt(args[2]));
                break;
            case 'list-rooms':
                this.listRooms();
                break;
            case 'select-room':
                this.selectRoom(parseInt(args[0]));
                break;
            case 'add-furniture':
                this.addFurniture(args[0], parseInt(args[1]), parseInt(args[2]));
                break;
            case 'list-furniture':
                this.listFurniture();
                break;
            case 'visualize':
                this.visualize();
                break;
            case 'help':
                this.createInterface();
                break;
            case 'exit':
                console.log('👋 Goodbye from Interir!');
                process.exit(0);
                break;
            default:
                console.log('❓ Unknown command. Type "help" for available commands.');
        }
    }

    addRoom(name, width, height) {
        if (!name || isNaN(width) || isNaN(height)) {
            console.log('❌ Usage: add-room [name] [width] [height]');
            return;
        }

        const room = {
            id: this.rooms.length,
            name: name,
            width: width,
            height: height,
            furniture: []
        };

        this.rooms.push(room);
        console.log(`✅ Added room: ${name} (${width}x${height})`);
    }

    listRooms() {
        if (this.rooms.length === 0) {
            console.log('📭 No rooms created yet.');
            return;
        }

        console.log('\n📋 Available Rooms:');
        this.rooms.forEach((room, index) => {
            console.log(`${index}: ${room.name} (${room.width}x${room.height})`);
        });
    }

    selectRoom(index) {
        if (index < 0 || index >= this.rooms.length) {
            console.log('❌ Invalid room index.');
            return;
        }

        this.currentRoom = this.rooms[index];
        console.log(`✅ Selected room: ${this.currentRoom.name}`);
    }

    addFurniture(type, x, y) {
        if (!this.currentRoom) {
            console.log('❌ No room selected. Use "select-room [index]" first.');
            return;
        }

        if (!type || isNaN(x) || isNaN(y)) {
            console.log('❌ Usage: add-furniture [type] [x] [y]');
            return;
        }

        if (x < 0 || x > this.currentRoom.width || y < 0 || y > this.currentRoom.height) {
            console.log('❌ Furniture position out of room bounds.');
            return;
        }

        const furniture = {
            type: type,
            x: x,
            y: y,
            id: this.currentRoom.furniture.length
        };

        this.currentRoom.furniture.push(furniture);
        console.log(`✅ Added ${type} at (${x}, ${y})`);
    }

    listFurniture() {
        if (!this.currentRoom) {
            console.log('❌ No room selected.');
            return;
        }

        if (this.currentRoom.furniture.length === 0) {
            console.log('📭 No furniture in this room.');
            return;
        }

        console.log(`\n🪑 Furniture in ${this.currentRoom.name}:`);
        this.currentRoom.furniture.forEach((item, index) => {
            console.log(`${index}: ${item.type} at (${item.x}, ${item.y})`);
        });
    }

    visualize() {
        if (!this.currentRoom) {
            console.log('❌ No room selected.');
            return;
        }

        console.log(`\n🏠 Visualization of ${this.currentRoom.name}:`);
        console.log('+' + '-'.repeat(this.currentRoom.width) + '+');

        for (let y = 0; y < this.currentRoom.height; y++) {
            let row = '|';
            for (let x = 0; x < this.currentRoom.width; x++) {
                const furniture = this.currentRoom.furniture.find(f => f.x === x && f.y === y);
                if (furniture) {
                    row += this.getFurnitureSymbol(furniture.type);
                } else {
                    row += ' ';
                }
            }
            row += '|';
            console.log(row);
        }

        console.log('+' + '-'.repeat(this.currentRoom.width) + '+');
    }

    getFurnitureSymbol(type) {
        const symbols = {
            'sofa': 'S',
            'table': 'T',
            'chair': 'C',
            'bed': 'B',
            'desk': 'D',
            'shelf': 'H',
            'plant': 'P',
            'lamp': 'L'
        };
        return symbols[type.toLowerCase()] || '?';
    }

    generateSampleData() {
        // Add some sample rooms
        this.addRoom('Living Room', 20, 15);
        this.addRoom('Bedroom', 15, 12);
        this.addRoom('Kitchen', 12, 10);

        // Select first room and add some furniture
        this.selectRoom(0);
        this.addFurniture('sofa', 5, 5);
        this.addFurniture('table', 10, 8);
        this.addFurniture('chair', 8, 8);
    }

    mainLoop() {
        if (this.isRunning && typeof process === 'undefined') {
            // Browser version
            console.log('🌐 Running in browser mode - use console commands');
        }
    }
}

// Export for Node.js or run in browser
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    const app = new InterirApp();
    app.init();
} else {
    // Browser environment
    console.log('🌐 Interir loaded. Create an instance with: const app = new InterirApp(); app.init();');
}
