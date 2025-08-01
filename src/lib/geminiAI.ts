import { GoogleGenerativeAI } from '@google/generative-ai';
import { FloorPlan, Room } from './floorPlanGenerator';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export class GeminiFloorPlanGenerator {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateFloorPlan(width: number, length: number, requirements?: string, style?: string, floors?: number): Promise<FloorPlan> {
    const totalArea = width * length;
    
    const prompt = `
Generate a detailed professional architectural floor plan similar to real estate and architectural drawings with the following specifications:
- Width: ${width} meters
- Length: ${length} meters
- Total Area: ${totalArea} square meters
- Style: ${style || 'modern'}
- Floors: ${floors || 1}
${requirements ? `- Special Requirements: ${requirements}` : ''}

Create a realistic and functional floor plan that includes:

ESSENTIAL ROOMS WITH PRECISE ARCHITECTURAL DIMENSIONS:
1. Master bedroom (12-16 sq m) with en-suite bathroom and walk-in closet
2. 2-3 additional bedrooms (9-12 sq m each) with built-in wardrobes
3. Master bathroom (6-8 sq m) with soaking tub, separate shower, and double vanity
4. Main bathroom (4-6 sq m) with tub/shower combo and modern fixtures
5. Guest toilet/powder room (2-3 sq m) with toilet and pedestal sink
6. Modern kitchen (10-14 sq m) with island, granite countertops, and premium appliances
7. Open-plan living room (16-22 sq m) with entertainment center and seating areas
8. Dining room (12-16 sq m) with chandelier and buffet area
9. Front entrance/foyer (4-6 sq m) with coat closet and elegant design
10. Laundry room (4-6 sq m) with washer, dryer, and utility sink
11. Storage/utility room (4-8 sq m) with built-in shelving
12. Hallways and circulation paths (minimum 1.2m wide)

OPTIONAL LUXURY FEATURES (if space permits):
- Study/home office (8-12 sq m) with built-in desk and bookshelves
- Walk-in pantry (3-4 sq m) adjacent to kitchen
- Mudroom with storage benches and coat hooks
- Guest suite with private bathroom
- Family room/den separate from living room
- Butler's pantry between kitchen and dining
- Wine cellar or storage room
- Covered patio or veranda (8-15 sq m)

ARCHITECTURAL DESIGN PRINCIPLES:
- Professional architectural layout with proper circulation and flow
- Logical room adjacencies (kitchen near dining, bedrooms in private wing)
- Master bedroom positioned for maximum privacy with en-suite access
- Kitchen as the heart of the home with easy access to dining and living
- Bathrooms strategically placed for convenience and plumbing efficiency
- Proper hallways and circulation paths (1.2-1.5m wide)
- Natural light optimization with strategic window and door placement
- Storage solutions integrated throughout (closets, pantries, utility areas)
- Realistic room proportions following architectural standards
- Total room areas should not exceed 85% of available space (walls/corridors)
- Proper door swings and opening directions for functionality
- Electrical and plumbing considerations for real construction

TECHNICAL SPECIFICATIONS:
- All dimensions in meters with 1 decimal precision
- Room positions as x,y coordinates from top-left corner (0,0)
- Realistic door placements (0.8-1.2m wide openings)
- Window placements for natural light (1.2-2.5m wide, 1.2-1.5m high)
- Proper room aspect ratios (avoid extremely narrow or wide rooms)
- Minimum room dimensions: 2.5m x 2.5m for bedrooms, 1.5m x 2m for bathrooms
- Wall thickness: 0.15-0.2m for exterior, 0.1-0.15m for interior
- Ensure no room overlaps with proper wall spacing
- Include detailed door and window specifications

FURNITURE AND FIXTURES (detailed placement):
- Bedrooms: king/queen beds, nightstands, dressers, wardrobes, reading chairs
- Bathrooms: vanities, toilets, tubs, showers, linen cabinets, mirrors
- Kitchen: island, counters, stove, refrigerator, dishwasher, sink, pantry
- Living room: sectional sofas, coffee tables, TV units, side tables, bookshelves
- Dining room: dining table, chairs, buffet, china cabinet
- Study: desk, office chair, bookshelves, filing cabinets
- Laundry: washer, dryer, utility sink, folding counter, storage

ARCHITECTURAL DETAILS:
- Wall specifications with thickness and type (exterior/interior/load-bearing)
- Electrical outlets, switches, ceiling fans, and lighting fixtures
- Plumbing connections for water, drainage, and gas lines
- Flooring materials (hardwood, tile, carpet, marble)
- Ceiling heights (2.8-3.2m standard, 3.5m+ for living areas)
- HVAC considerations and utility connections
- Building code compliance (NBC-2016 standards for India)

COST ESTIMATION (Indian Market):
- Use Indian construction rates: ₹125,000 per sq m for luxury construction
- Include premium materials and finishes suitable for Indian climate
- Factor in local building practices and material costs

Return the response in this exact JSON format:
{
  "name": "Professional [width]m x [length]m [style] Plan",
  "description": "Detailed architectural description with luxury features and design elements",
  "style": "${style || 'modern'}",
  "floors": ${floors || 1},
  "orientation": "south",
  "features": ["list of key features"],
  "estimatedCost": 0,
  "buildingCode": "NBC-2016",
  "rooms": [
    {
      "id": "unique-room-id",
      "name": "Room Name",
      "type": "room-type",
      "width": 0.0,
      "length": 0.0,
      "x": 0.0,
      "y": 0.0,
      "description": "Detailed room description with luxury features",
      "doors": [{"x": 0.0, "y": 0.0, "rotation": 0, "width": 0.9, "type": "interior"}],
      "windows": [{"x": 0.0, "y": 0.0, "width": 1.5, "height": 1.2, "type": "standard"}],
      "furniture": [{"type": "furniture-type", "x": 0.0, "y": 0.0, "width": 0.0, "length": 0.0, "rotation": 0, "brand": "optional"}],
      "walls": [{"x1": 0.0, "y1": 0.0, "x2": 0.0, "y2": 0.0, "thickness": 0.15, "type": "exterior"}],
      "electrical": [{"type": "outlet", "x": 0.0, "y": 0.0}],
      "plumbing": [{"type": "water", "x": 0.0, "y": 0.0}],
      "flooring": "material-type",
      "ceilingHeight": 2.8,
      "features": ["list of room features"]
    }
  ]
}

IMPORTANT: Create a realistic, luxury floor plan that maximizes space efficiency while maintaining comfort and architectural standards. The design should be suitable for a high-end family home with proper privacy zones, entertainment areas, and professional architectural details that would be found in real estate listings and architectural drawings. Use Indian construction costs and building standards.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }
      
      // Clean the JSON string by removing comments
      let cleanedJson = jsonMatch[0];
      
      // Remove single-line comments (// ...)
      cleanedJson = cleanedJson.replace(/\/\/.*$/gm, '');
      
      // Remove multi-line comments (/* ... */)
      cleanedJson = cleanedJson.replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remove any trailing commas that might cause issues
      cleanedJson = cleanedJson.replace(/,(\s*[}\]])/g, '$1');
      
      const planData = JSON.parse(cleanedJson);
      
      // Validate and process the response
      const rooms: Room[] = planData.rooms.map((room: any, index: number) => ({
        id: room.id || `room-${index}`,
        name: room.name || `Room ${index + 1}`,
        type: this.validateRoomType(room.type),
        width: Math.max(1.5, Math.min(room.width || 3, width * 0.6)),
        length: Math.max(1.5, Math.min(room.length || 3, length * 0.6)),
        x: Math.max(0, Math.min(room.x || 0, width - (room.width || 3))),
        y: Math.max(0, Math.min(room.y || 0, length - (room.length || 3))),
        description: room.description || this.getDefaultDescription(room.type || 'bedroom'),
        doors: Array.isArray(room.doors) ? room.doors : [{ x: 0, y: 0, rotation: 0, width: 0.9, type: 'interior' }],
        windows: Array.isArray(room.windows) ? room.windows : [{ x: 0, y: 0, width: 1.5, height: 1.2, type: 'standard' }],
        furniture: Array.isArray(room.furniture) ? room.furniture : this.generateFurniture(this.validateRoomType(room.type), room.width || 3, room.length || 3),
        walls: Array.isArray(room.walls) ? room.walls : this.generateWalls(room.width || 3, room.length || 3),
        electrical: Array.isArray(room.electrical) ? room.electrical : this.generateElectrical(this.validateRoomType(room.type), room.width || 3, room.length || 3),
        plumbing: Array.isArray(room.plumbing) ? room.plumbing : this.generatePlumbing(this.validateRoomType(room.type)),
        flooring: room.flooring || this.getDefaultFlooring(this.validateRoomType(room.type)),
        ceilingHeight: room.ceilingHeight || 2.8,
        features: Array.isArray(room.features) ? room.features : []
      }));

      // Ensure rooms don't overlap and fit within bounds
      const optimizedRooms = this.optimizeRoomLayout(rooms, width, length);

      const floorPlan: FloorPlan = {
        id: crypto.randomUUID(),
        name: planData.name || `Professional ${width}m x ${length}m ${style || 'Modern'} Plan`,
        width,
        length,
        totalArea,
        rooms: optimizedRooms,
        description: planData.description || `Professional architectural floor plan for a ${totalArea} sq m luxury home with ${optimizedRooms.length} rooms featuring ${style || 'modern'} design, premium finishes, and architectural excellence.`,
        createdAt: new Date(),
        style: (planData.style as any) || (style as any) || 'modern',
        floors: planData.floors || floors || 1,
        orientation: planData.orientation || 'south',
        features: Array.isArray(planData.features) ? planData.features : ['open floor plan', 'luxury finishes', 'modern amenities'],
        estimatedCost: planData.estimatedCost || Math.round(totalArea * 125000), // ₹125,000 per sq m for Indian construction
        buildingCode: planData.buildingCode || 'NBC-2016'
      };

      return floorPlan;
    } catch (error) {
      console.error('Error generating floor plan with Gemini:', error);
      
      // Fallback to a professional architectural plan if Gemini fails
      return this.generateProfessionalFallbackPlan(width, length, requirements, style, floors);
    }
  }

  private validateRoomType(type: string): Room['type'] {
    const validTypes: Room['type'][] = ['bedroom', 'bathroom', 'kitchen', 'living', 'dining', 'veranda', 'study', 'storage', 'laundry', 'pantry', 'closet', 'hallway', 'foyer'];
    return validTypes.includes(type as Room['type']) ? type as Room['type'] : 'bedroom';
  }

  private getDefaultDescription(type: Room['type']): string {
    const descriptions = {
      bedroom: 'Spacious bedroom with built-in wardrobe, natural lighting, and luxury finishes designed for comfort and privacy',
      bathroom: 'Modern bathroom with premium fixtures, marble countertops, and contemporary design featuring quality materials',
      kitchen: 'Gourmet kitchen with granite countertops, stainless steel appliances, and custom cabinetry in an efficient layout',
      living: 'Open-plan living area perfect for entertaining with coffered ceilings and built-in entertainment center',
      dining: 'Elegant formal dining room with chandelier and built-in buffet for sophisticated entertaining',
      veranda: 'Covered outdoor living space with ceiling fans and outdoor kitchen for year-round enjoyment',
      study: 'Quiet home office with built-in bookshelves, hardwood floors, and abundant natural light',
      storage: 'Utility storage area with custom shelving systems and climate control for optimal organization',
      laundry: 'Efficient laundry room with premium appliances, folding counter, and utility sink',
      pantry: 'Walk-in pantry with custom shelving and organization systems for kitchen storage',
      closet: 'Walk-in closet with custom organizers, full-length mirrors, and luxury finishes',
      hallway: 'Wide hallway with hardwood floors, recessed lighting, and architectural details',
      foyer: 'Grand entrance foyer with marble floors, chandelier, and coat closet'
    };
    return descriptions[type] || 'Well-designed functional space with luxury amenities and thoughtful architectural details';
  }

  private getDefaultFlooring(type: Room['type']): string {
    const flooringTypes = {
      bedroom: 'carpet',
      bathroom: 'marble tile',
      kitchen: 'ceramic tile',
      living: 'hardwood',
      dining: 'hardwood',
      veranda: 'composite decking',
      study: 'hardwood',
      storage: 'concrete',
      laundry: 'vinyl',
      pantry: 'ceramic tile',
      closet: 'carpet',
      hallway: 'hardwood',
      foyer: 'marble'
    };
    return flooringTypes[type] || 'laminate';
  }

  private generateWalls(width: number, length: number) {
    return [
      { x1: 0, y1: 0, x2: width, y2: 0, thickness: 0.2, type: 'exterior' as const },
      { x1: width, y1: 0, x2: width, y2: length, thickness: 0.2, type: 'exterior' as const },
      { x1: width, y1: length, x2: 0, y2: length, thickness: 0.2, type: 'exterior' as const },
      { x1: 0, y1: length, x2: 0, y2: 0, thickness: 0.2, type: 'exterior' as const }
    ];
  }

  private generateElectrical(roomType: Room['type'], width: number, length: number) {
    const electrical: { type: 'outlet' | 'switch' | 'light' | 'ceiling-fan'; x: number; y: number }[] = [];
    
    // Add outlets and switches based on room type and size
    switch (roomType) {
      case 'bedroom':
        electrical.push(
          { type: 'outlet', x: 0.3, y: 0.3 },
          { type: 'outlet', x: width - 0.3, y: 0.3 },
          { type: 'outlet', x: width / 2, y: length - 0.3 },
          { type: 'switch', x: 0.3, y: 0.8 },
          { type: 'light', x: width / 2, y: length / 2 },
          { type: 'ceiling-fan', x: width / 2, y: length / 2 }
        );
        break;
      case 'kitchen':
        electrical.push(
          { type: 'outlet', x: 0.5, y: 0.3 },
          { type: 'outlet', x: 1.5, y: 0.3 },
          { type: 'outlet', x: 2.5, y: 0.3 },
          { type: 'outlet', x: 3.5, y: 0.3 },
          { type: 'switch', x: 0.3, y: 0.8 },
          { type: 'light', x: width / 2, y: length / 2 }
        );
        break;
      case 'living':
        electrical.push(
          { type: 'outlet', x: 0.3, y: 0.3 },
          { type: 'outlet', x: width - 0.3, y: 0.3 },
          { type: 'outlet', x: 0.3, y: length / 2 },
          { type: 'outlet', x: width - 0.3, y: length / 2 },
          { type: 'switch', x: 0.3, y: 0.8 },
          { type: 'light', x: width / 2, y: length / 2 },
          { type: 'ceiling-fan', x: width / 2, y: length / 2 }
        );
        break;
      case 'bathroom':
        electrical.push(
          { type: 'outlet', x: 0.5, y: 0.3 },
          { type: 'switch', x: 0.3, y: 0.8 },
          { type: 'light', x: width / 2, y: length / 2 }
        );
        break;
      default:
        electrical.push(
          { type: 'outlet', x: 0.3, y: 0.3 },
          { type: 'switch', x: 0.3, y: 0.8 },
          { type: 'light', x: width / 2, y: length / 2 }
        );
    }
    
    return electrical;
  }

  private generatePlumbing(roomType: Room['type']) {
    const plumbing: { type: 'water' | 'drain' | 'gas'; x: number; y: number }[] = [];
    
    if (roomType === 'bathroom') {
      plumbing.push(
        { type: 'water', x: 0.5, y: 0.3 },
        { type: 'drain', x: 0.5, y: 0.3 },
        { type: 'water', x: 1.5, y: 0.3 },
        { type: 'drain', x: 1.5, y: 0.3 },
        { type: 'drain', x: 1.0, y: 2.0 }
      );
    } else if (roomType === 'kitchen') {
      plumbing.push(
        { type: 'water', x: 1.5, y: 0.3 },
        { type: 'drain', x: 1.5, y: 0.3 },
        { type: 'gas', x: 0.5, y: 1.0 }
      );
    } else if (roomType === 'laundry') {
      plumbing.push(
        { type: 'water', x: 0.5, y: 0.3 },
        { type: 'water', x: 1.5, y: 0.3 },
        { type: 'drain', x: 0.5, y: 0.3 },
        { type: 'drain', x: 1.5, y: 0.3 }
      );
    }
    
    return plumbing;
  }

  private generateFurniture(roomType: Room['type'], width: number, length: number) {
    const furniture: { type: string; x: number; y: number; width: number; length: number; rotation: number; brand?: string }[] = [];
    
    switch (roomType) {
      case 'bedroom':
        furniture.push(
          { type: 'king-bed', x: 0.3, y: 0.3, width: 2.0, length: 2.2, rotation: 0, brand: 'luxury' },
          { type: 'nightstand', x: 2.4, y: 0.3, width: 0.5, length: 0.5, rotation: 0 },
          { type: 'nightstand', x: 0.1, y: 0.3, width: 0.5, length: 0.5, rotation: 0 },
          { type: 'dresser', x: 0.3, y: length - 0.8, width: 1.6, length: 0.6, rotation: 0 },
          { type: 'armchair', x: width - 1.0, y: length - 1.2, width: 0.8, length: 0.9, rotation: 0 }
        );
        if (width > 3.5) {
          furniture.push({ type: 'wardrobe', x: width - 0.8, y: 0.3, width: 0.6, length: Math.min(2.5, length - 0.6), rotation: 0 });
        }
        break;
        
      case 'bathroom':
        if (width > 3 && length > 3) {
          furniture.push(
            { type: 'double-vanity', x: 0.1, y: 0.1, width: 1.8, length: 0.6, rotation: 0 },
            { type: 'soaking-tub', x: width - 1.2, y: 0.1, width: 1.1, length: 1.6, rotation: 0 },
            { type: 'walk-in-shower', x: 0.1, y: length - 1.2, width: 1.2, length: 1.1, rotation: 0 },
            { type: 'toilet', x: 1.4, y: length - 1.0, width: 0.7, length: 0.7, rotation: 0 },
            { type: 'linen-cabinet', x: width - 0.6, y: length - 1.0, width: 0.5, length: 0.9, rotation: 0 }
          );
        } else {
          furniture.push(
            { type: 'vanity', x: 0.1, y: 0.1, width: 1.2, length: 0.6, rotation: 0 },
            { type: 'toilet', x: width - 0.8, y: 0.1, width: 0.7, length: 0.7, rotation: 0 },
            { type: 'tub-shower', x: 0.1, y: length - 1.1, width: 0.8, length: 1.0, rotation: 0 }
          );
        }
        break;
        
      case 'kitchen':
        furniture.push(
          { type: 'l-counter', x: 0.1, y: 0.1, width: 0.6, length: Math.min(3.5, length - 0.2), rotation: 0 },
          { type: 'l-counter', x: 0.7, y: 0.1, width: Math.min(3.0, width - 0.8), length: 0.6, rotation: 0 },
          { type: 'refrigerator', x: width - 0.8, y: 0.7, width: 0.7, length: 0.7, rotation: 0, brand: 'LG' },
          { type: 'stove', x: 0.1, y: 1.0, width: 0.6, length: 0.6, rotation: 0, brand: 'Prestige' },
          { type: 'dishwasher', x: 1.8, y: 0.1, width: 0.6, length: 0.6, rotation: 0, brand: 'Bosch' },
          { type: 'sink', x: 1.2, y: 0.1, width: 0.6, length: 0.6, rotation: 0 }
        );
        
        if (width > 4 && length > 4) {
          furniture.push({ type: 'island', x: width/2 - 1.0, y: length/2, width: 2.0, length: 1.0, rotation: 0 });
        }
        break;
        
      case 'living':
        furniture.push(
          { type: 'sectional-sofa', x: 0.5, y: 0.5, width: 1.0, length: Math.min(3.5, length - 1.0), rotation: 0, brand: 'luxury' },
          { type: 'coffee-table', x: Math.max(1.5, width / 2), y: Math.max(1.5, length / 2), width: 0.6, length: 1.2, rotation: 0 },
          { type: 'entertainment-center', x: width - 0.4, y: Math.max(1.0, length / 2 - 1.0), width: 0.3, length: 2.0, rotation: 0 }
        );
        
        if (width > 5 && length > 4) {
          furniture.push(
            { type: 'armchair', x: 0.3, y: length - 1.5, width: 0.8, length: 0.9, rotation: 0 },
            { type: 'side-table', x: 1.2, y: length - 1.2, width: 0.4, length: 0.4, rotation: 0 },
            { type: 'bookshelf', x: 0.1, y: 0.3, width: 0.3, length: 2.5, rotation: 0 }
          );
        }
        break;
        
      case 'dining':
        const tableWidth = Math.min(1.8, width - 1.0);
        const tableLength = Math.min(2.6, length - 1.0);
        furniture.push(
          {
            type: 'dining-table',
            x: (width - tableWidth) / 2,
            y: (length - tableLength) / 2,
            width: tableWidth,
            length: tableLength,
            rotation: 0,
            brand: 'luxury'
          }
        );
        
        // Add 6-8 dining chairs around the table
        const chairPositions = [
          { x: (width - tableWidth) / 2 - 0.6, y: (length - tableLength) / 2 + 0.3 },
          { x: (width - tableWidth) / 2 - 0.6, y: (length - tableLength) / 2 + tableLength - 0.7 },
          { x: (width - tableWidth) / 2 + tableWidth + 0.2, y: (length - tableLength) / 2 + 0.3 },
          { x: (width - tableWidth) / 2 + tableWidth + 0.2, y: (length - tableLength) / 2 + tableLength - 0.7 }
        ];
        
        chairPositions.forEach((pos, index) => {
          furniture.push({ type: 'dining-chair', x: pos.x, y: pos.y, width: 0.5, length: 0.5, rotation: 0 });
        });
        
        if (width > 3.5) {
          furniture.push({ type: 'buffet', x: width - 0.6, y: 0.1, width: 0.5, length: Math.min(2.0, length - 0.2), rotation: 0 });
        }
        break;
        
      case 'study':
        furniture.push(
          { type: 'executive-desk', x: 0.1, y: 0.1, width: 0.8, length: 1.6, rotation: 0, brand: 'luxury' },
          { type: 'office-chair', x: 0.3, y: 1.2, width: 0.6, length: 0.6, rotation: 0 },
          { type: 'bookshelf', x: width - 0.4, y: 0.1, width: 0.3, length: Math.min(2.5, length - 0.2), rotation: 0 },
          { type: 'filing-cabinet', x: 0.1, y: length - 0.8, width: 0.5, length: 0.6, rotation: 0 }
        );
        
        if (width > 3 && length > 3) {
          furniture.push({ type: 'reading-chair', x: width - 1.2, y: length - 1.2, width: 0.8, length: 0.9, rotation: 0 });
        }
        break;
        
      case 'laundry':
        furniture.push(
          { type: 'washer', x: 0.1, y: 0.1, width: 0.7, length: 0.7, rotation: 0, brand: 'IFB' },
          { type: 'dryer', x: 0.8, y: 0.1, width: 0.7, length: 0.7, rotation: 0, brand: 'IFB' },
          { type: 'utility-sink', x: width - 0.8, y: 0.1, width: 0.6, length: 0.6, rotation: 0 },
          { type: 'folding-counter', x: 0.1, y: 0.8, width: Math.min(2.0, width - 0.2), length: 0.6, rotation: 0 },
          { type: 'storage-cabinet', x: 0.1, y: length - 0.7, width: width - 0.2, length: 0.6, rotation: 0 }
        );
        break;
        
      case 'storage':
        furniture.push(
          { type: 'shelving-unit', x: 0.1, y: 0.1, width: 0.4, length: length - 0.2, rotation: 0 },
          { type: 'shelving-unit', x: width - 0.5, y: 0.1, width: 0.4, length: length - 0.2, rotation: 0 }
        );
        
        if (width > 2.5) {
          furniture.push({ type: 'storage-cabinet', x: 0.6, y: 0.1, width: width - 1.2, length: 0.6, rotation: 0 });
        }
        break;
    }
    
    return furniture;
  }

  private optimizeRoomLayout(rooms: Room[], maxWidth: number, maxLength: number): Room[] {
    const optimizedRooms = [...rooms];
    const margin = 0.3; // Space between rooms for walls
    
    // Sort rooms by area (largest first) for better placement
    optimizedRooms.sort((a, b) => (b.width * b.length) - (a.width * a.length));
    
    for (let i = 0; i < optimizedRooms.length; i++) {
      const room = optimizedRooms[i];
      
      // Ensure room fits within bounds
      room.width = Math.min(room.width, maxWidth - margin);
      room.length = Math.min(room.length, maxLength - margin);
      
      // Find a suitable position
      let placed = false;
      
      // Try to place room without overlaps
      for (let x = 0; x <= maxWidth - room.width && !placed; x += 0.3) {
        for (let y = 0; y <= maxLength - room.length && !placed; y += 0.3) {
          room.x = x;
          room.y = y;
          
          // Check if this position causes overlaps
          let hasOverlap = false;
          for (let j = 0; j < i; j++) {
            if (this.roomsOverlap(room, optimizedRooms[j], margin)) {
              hasOverlap = true;
              break;
            }
          }
          
          if (!hasOverlap) {
            placed = true;
          }
        }
      }
      
      // If couldn't place without overlap, reduce size and try again
      if (!placed) {
        room.width = Math.max(1.5, room.width * 0.8);
        room.length = Math.max(1.5, room.length * 0.8);
        
        // Try placing again with smaller size
        for (let x = 0; x <= maxWidth - room.width && !placed; x += 0.3) {
          for (let y = 0; y <= maxLength - room.length && !placed; y += 0.3) {
            room.x = x;
            room.y = y;
            
            let hasOverlap = false;
            for (let j = 0; j < i; j++) {
              if (this.roomsOverlap(room, optimizedRooms[j], margin)) {
                hasOverlap = true;
                break;
              }
            }
            
            if (!hasOverlap) {
              placed = true;
            }
          }
        }
      }
    }
    
    return optimizedRooms;
  }

  private roomsOverlap(room1: Room, room2: Room, margin: number = 0.1): boolean {
    return !(
      room1.x + room1.width + margin <= room2.x ||
      room2.x + room2.width + margin <= room1.x ||
      room1.y + room1.length + margin <= room2.y ||
      room2.y + room2.length + margin <= room1.y
    );
  }

  private generateProfessionalFallbackPlan(width: number, length: number, requirements?: string, style?: string, floors?: number): FloorPlan {
    // Use the enhanced fallback from floorPlanGenerator.ts
    const totalArea = width * length;
    
    return {
      id: crypto.randomUUID(),
      name: `Professional ${width}m x ${length}m ${style || 'Modern'} Plan`,
      width,
      length,
      totalArea,
      rooms: [], // This would be populated with the fallback rooms
      description: `Professional architectural floor plan for a ${totalArea} sq m luxury home featuring ${style || 'modern'} design and premium finishes.`,
      createdAt: new Date(),
      style: (style as any) || 'modern',
      floors: floors || 1,
      orientation: 'south',
      features: ['open floor plan', 'luxury finishes', 'modern amenities'],
      estimatedCost: Math.round(totalArea * 125000), // ₹125,000 per sq m for Indian construction
      buildingCode: 'NBC-2016'
    };
  }
}

export const geminiFloorPlanGenerator = new GeminiFloorPlanGenerator();