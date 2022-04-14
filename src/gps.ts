import Geolocation from 'react-native-geolocation-service';

export const gpsSettings: Geolocation.GeoOptions = {
  accuracy: {
    android: 'high',
    ios: 'best',
  },
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
  distanceFilter: 0,
  forceRequestLocation: true,
  forceLocationManager: false,
  showLocationDialog: true,
};
