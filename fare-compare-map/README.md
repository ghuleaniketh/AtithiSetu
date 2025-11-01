# Fare Compare Map

This project is a fare comparison tool that allows users to compare ride fares from different providers such as OLA, Uber, and Rapido. It features a functional map that displays the pickup and dropoff locations along with the route between them.

## Project Structure

The project is organized into several directories and files:

- **src/pages/fare-compare.tsx**: Main component for comparing fares from different providers. Handles user input for pickup and dropoff locations, displays fare results, and allows users to choose a provider.
  
- **src/components/MapView.tsx**: Responsible for rendering the map using mapping libraries (like Mapbox or Leaflet) to display the map and the route between the pickup and dropoff locations.
  
- **src/components/RouteLayer.tsx**: Overlays the route on the map. Takes the coordinates of the pickup and dropoff locations and draws the path between them.
  
- **src/components/ProviderCard.tsx**: Displays information about each ride provider, including fare, ETA, and any surge pricing. Allows users to select a provider.
  
- **src/hooks/useMap.ts**: Custom hook that manages the map's state and interactions. Handles map initialization, updating the route, and any other map-related logic.
  
- **src/services/maps/mapbox.ts**: Functions to interact with the Mapbox API, such as fetching routes and displaying the map.
  
- **src/services/maps/leaflet.ts**: Functions to interact with the Leaflet library, providing similar functionality as the Mapbox service.
  
- **src/services/providers.ts**: Functions to fetch and manage ride provider data, including fare estimates and provider details.
  
- **src/types/index.ts**: TypeScript types and interfaces used throughout the project, ensuring type safety for components and services.
  
- **src/utils/geo.ts**: Helper functions for geographical calculations, such as distance between coordinates or converting addresses to coordinates.
  
- **src/App.tsx**: Main application component that sets up routing and renders the main pages of the application.
  
- **src/main.tsx**: Entry point of the application. Renders the App component into the DOM.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd fare-compare-map
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage Guidelines

- Enter the pickup and dropoff locations in the input fields.
- Click on "Compare Fares" to see the fare estimates from different providers.
- Select a provider to view more details and confirm your booking.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.