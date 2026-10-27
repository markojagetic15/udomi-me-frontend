import { MapContainer, TileLayer, Circle } from 'react-leaflet';

// Approximate area only (500 m circle), never a pin on someone's house.
export const ListingMap = ({ lat, lng }: { lat: number; lng: number }) => (
  <div className='h-64 overflow-hidden rounded-xl border'>
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      className='h-full w-full'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Circle
        center={[lat, lng]}
        radius={500}
        pathOptions={{
          color: '#3f6b55',
          fillColor: '#8eaf9d',
          fillOpacity: 0.35,
        }}
      />
    </MapContainer>
  </div>
);
