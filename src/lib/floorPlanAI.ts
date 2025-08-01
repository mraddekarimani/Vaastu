import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import { Room, FloorPlan } from './floorPlanGenerator';

// Room dimension constraints
const ROOM_CONSTRAINTS = {
  bedroom: { minArea: 9, maxArea: 16, minRatio: 0.75, maxRatio: 1.5 },
  bathroom: { minArea: 3, maxArea: 6, minRatio: 0.6, maxRatio: 1.2 },
  kitchen: { minArea: 6, maxArea: 12, minRatio: 0.8, maxRatio: 1.3 },
  living: { minArea: 12, maxArea: 20, minRatio: 0.8, maxRatio: 1.4 },
  dining: { minArea: 8, maxArea: 15, minRatio: 0.8, maxRatio: 1.3 },
  veranda: { minArea: 4, maxArea: 8, minRatio: 1.5, maxRatio: 2.5 }
};

// Adjacency preferences matrix
const ADJACENCY_MATRIX = new Matrix([
  [1, 0.8, 0.6, 0.2, 0.2, 0.4], // living
  [0.8, 1, 0.9, 0.3, 0.3, 0.2], // dining
  [0.6, 0.9, 1, 0.2, 0.2, 0.1], // kitchen
  [0.2, 0.3, 0.2, 1, 0.7, 0.3], // bedroom
  [0.2, 0.3, 0.2, 0.7, 1, 0.2], // bathroom
  [0.4, 0.2, 0.1, 0.3, 0.2, 1]  // veranda
]);

export class FloorPlanAI {
  private model: tf.LayersModel | null = null;

  async initialize() {
    // Create a simple neural network for room layout optimization
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [6], units: 12, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 6, activation: 'sigmoid' })
      ]
    });

    await this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
  }

  generateVariation(basePlan: FloorPlan): FloorPlan {
    const rooms = [...basePlan.rooms];
    
    // Apply random variations while maintaining constraints
    rooms.forEach(room => {
      const constraints = ROOM_CONSTRAINTS[room.type];
      
      // Randomly adjust room dimensions within constraints
      const areaVariation = Math.random() * 0.2 - 0.1; // ±10% variation
      const ratioVariation = Math.random() * 0.1 - 0.05; // ±5% variation
      
      const currentArea = room.width * room.length;
      const currentRatio = room.width / room.length;
      
      const newArea = Math.max(
        constraints.minArea,
        Math.min(constraints.maxArea, currentArea * (1 + areaVariation))
      );
      
      const newRatio = Math.max(
        constraints.minRatio,
        Math.min(constraints.maxRatio, currentRatio * (1 + ratioVariation))
      );
      
      // Update dimensions while maintaining area and ratio constraints
      room.width = Math.sqrt(newArea * newRatio);
      room.length = Math.sqrt(newArea / newRatio);
    });

    // Optimize room placement using adjacency matrix
    this.optimizeLayout(rooms);

    return {
      ...basePlan,
      rooms,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
  }

  private optimizeLayout(rooms: Room[]) {
    // Use adjacency matrix to optimize room positions
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const room1 = rooms[i];
        const room2 = rooms[j];
        
        const adjacencyScore = ADJACENCY_MATRIX.get(
          this.getRoomTypeIndex(room1.type),
          this.getRoomTypeIndex(room2.type)
        );
        
        if (adjacencyScore > 0.7) {
          // Adjust room positions to be adjacent
          this.makeRoomsAdjacent(room1, room2);
        }
      }
    }
  }

  private getRoomTypeIndex(type: Room['type']): number {
    const types = ['living', 'dining', 'kitchen', 'bedroom', 'bathroom', 'veranda'];
    return types.indexOf(type);
  }

  private makeRoomsAdjacent(room1: Room, room2: Room) {
    // Calculate optimal positions to make rooms adjacent
    const gap = 0.2; // Minimum gap between rooms
    
    if (room1.type === 'living' && room2.type === 'dining') {
      room2.x = room1.x;
      room2.y = room1.y + room1.length + gap;
    } else if (room1.type === 'kitchen' && room2.type === 'dining') {
      room2.x = room1.x + room1.width + gap;
      room2.y = room1.y;
    }
  }
}

export const floorPlanAI = new FloorPlanAI();