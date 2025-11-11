import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function Map({ location }) {
  if (!location) {
    return null
  }

  const position = [location.lat, location.lng]

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden z-0 mb-4">
      <MapContainer center={position} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>You are here.</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}