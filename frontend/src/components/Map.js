import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const Map = ({ center, zoom, markers, style, mapStyle }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(
    (mapInstance) => {
      // const bounds = new window.google.maps.LatLngBounds(center);
      // map.fitBounds(bounds);
      /**
       The function of map.fitBounds(bounds) is to automatically adjust the map's field of view based on the specified LatLngBounds object to ensure that the map area contained within this bounding box is visible. This is often useful when multiple markers or a specific area need to be displayed so that the user can see all markers or a specific geographic area.
       */
      setMap(mapInstance);
      /**
       setMap(map) is typically used to store a map object in the component's state so that further operations on the map can be performed later. In your code, these two lines of code are commented out, so they don't do anything.
       */
    },
    [center]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className={style}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapStyle}
          center={center}
          zoom={zoom}
          defaultZoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {markers && markers.map((marker, index) => <Marker key={index} position={marker.position} />)}
        </GoogleMap>
      ) : (
        <div>Loading Map...</div>
      )}
    </div>
  );
};

export default Map;
