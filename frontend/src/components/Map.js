import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const Map = ({ center, zoom, markers, style, mapStyle }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_MAP_API_KEY,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!markers) return;

  return (
    <div className={style}>
      {isLoaded ? (
        <GoogleMap mapContainerStyle={mapStyle} center={center} zoom={zoom} onLoad={onLoad} onUnmount={onUnmount}>
          {markers && markers.map((marker, index) => <Marker key={index} position={marker.position} />)}
        </GoogleMap>
      ) : (
        <div>Loading Map...</div>
      )}
    </div>
  );
};

export default Map;
