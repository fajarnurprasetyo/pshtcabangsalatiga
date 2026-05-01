import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { Geopoint } from "@sanity/google-maps-input";
import { TextInput } from "@sanity/ui";
import { useState } from "react";
import { set, type ObjectInputProps } from "sanity";
import { googleMapsApiKey } from "../env";

const defaultCenter = {
  lat: -7.330153687367675,
  lng: 110.49962493360177,
};

async function reverseLeafletGeocode(latLng: google.maps.LatLng) {
  const lat = latLng.lat();
  const lng = latLng.lng();

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const result = await fetch(url).then((res) => res.json());

  return {
    placeName: "",
    address: result?.display_name || "",
  };
}

async function reverseGoogleGeocode(latLng: google.maps.LatLng) {
  const lat = latLng.lat();
  const lng = latLng.lng();

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`;
  const result = await fetch(url)
    .then((res) => res.json())
    .then((data) => data.results?.[0]);

  return {
    placeName:
      result?.address_components?.[0]?.long_name ||
      result?.formatted_address ||
      "",
    address: result?.formatted_address || "",
  };
}

export interface LocationValue {
  geo?: Geopoint;
  placeName?: string;
  address?: string;
}

export default function LocationInput(props: ObjectInputProps<LocationValue>) {
  const { value, onChange } = props;

  const [marker, setMarker] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral
  >(
    value?.geo?.lat && value?.geo?.lng
      ? { lat: value.geo.lat, lng: value.geo.lng }
      : defaultCenter,
  );

  const [placeName, setPlaceName] = useState(value?.placeName || "");
  const [address, setAddress] = useState(value?.address || "");

  const handleMapLoad = (map: google.maps.Map) => {
    map.setCenter(defaultCenter);
    map.setZoom(14);
  };

  const handleMapClick = async ({ latLng }: google.maps.MapMouseEvent) => {
    if (!latLng) return;
    setMarker(latLng);

    // const geoData = await reverseGoogleGeocode(latLng);
    // setPlaceName(geoData.placeName);
    // setAddress(geoData.address);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
  });

  // async function handlePickLocation() {
  //   // 🔴 GANTI INI dengan Google Maps / Leaflet click event
  //   const lat = -6.200000;
  //   const lng = 106.816666;

  //   const geoData = await reverseGeocode(lat, lng);

  //   setAddress(geoData.address);
  //   setPlaceName(geoData.placeName);

  //   onChange(
  //     PatchEvent.from([
  //       setIfMissing({}),
  //       set({ lat, lng, alt: 0 }, ["geo"]),
  //       set(geoData.address, ["address"]),
  //       set(geoData.placeName, ["placeName"]),
  //     ])
  //   );
  // }

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ height: "400px" }}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
        >
          <Marker position={marker} />
        </GoogleMap>
      )}
      <TextInput
        placeholder="Place Name"
        value={placeName}
        onChange={({ target }) => {
          setPlaceName(target.value);
          onChange(set(target.value, ["placeName"]));
        }}
      />
      {/* <TextArea
        placeholder="Full Address"
        value={address}
        onChange={({ target }) => {
          setAddress(target.value);
          onChange(set(target.value, ["address"]));
        }}
      /> */}
    </>
  );
}
