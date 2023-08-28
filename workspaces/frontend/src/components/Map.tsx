import React, { useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultMapProps = {
  center: {
    lat: 42.882004,
    lng: 74.582748,
  },
  zoom: 13,
};

interface Props {
  onMapClick?: () => void;
}

function AppMap({ onMapClick }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyB7rWQz-H00zcMcfGI4OCvwuypMOTYgV7g",
  });

  const [map, setMap] = React.useState<any>(null);

  const [cords, setCords] = useState({
    lat: null as number | null,
    lng: null as number | null,
  });

  const onLoad = React.useCallback((map: any) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    setCords({
      lat: lat!,
      lng: lng!,
    });

    onMapClick?.();
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultMapProps.center}
      zoom={defaultMapProps.zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
      options={{ disableDefaultUI: true }}
    >
      {cords.lat && cords.lng && (
        <Marker
          key={Date.now()}
          animation={google.maps.Animation.BOUNCE}
          position={{
            lat: +cords.lat,
            lng: +cords.lng,
          }}
        />
      )}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default AppMap;
