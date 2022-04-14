/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
  FlatList,
  LogBox,
} from 'react-native';

import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GOOGLE_PLACE_API, AUTOCOMPLETE, TOKEN, IPlaceInfo, IPlace } from './src/API';

import useDebounce from './src/useDebounce';
import { hasLocationPermission } from './src/permission';

import { SearchBar } from './src/components/SearchBar/SearchBar';
import { PlaceItem } from './src/components/PredicatedItem/PlaceItem';
import { PlaceModal } from './src/components/PlaceModal/PlaceModal';

import { gpsSettings } from './src/gps';

import { IPredictionType } from './src/Interface/IPrediction';

LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [userLocation, setUserLocation] = useState<Geolocation.GeoPosition | null>(null);
  const [mapDelta, setMapDelta] = useState({ latitudeDelta: 0.03, longitudeDelta: 0.02 });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [predictions, setPredictions] = useState<IPredictionType[]>([]);

  const [selectedPlace, setSelectedPlace] = useState<IPlace | null>(null);
  const [placeInfo, setPlaceInfo] = useState<IPlaceInfo | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const mapRef = useRef<any>();

  const debouncedSearchTerm = useDebounce(searchTerm, 800);

  console.log('PRED', userLocation);

  const animateMap = useCallback(() => {
    if (mapRef.current) {
      if (placeInfo) {
        mapRef.current?.animateToRegion(
          {
            latitude: placeInfo.geometry.location.lat,
            longitude: placeInfo.geometry.location.lng,
            latitudeDelta: 0.03,
            longitudeDelta: 0.02,
          },
          700,
        );
      }
    }
  }, [placeInfo]);

  useEffect(() => {
    if (placeInfo) {
      animateMap();
    }
  }, [placeInfo, animateMap]);

  useEffect(() => {
    animateMap();
  }, [animateMap, placeInfo]);

  const selectPlace = (item: IPlace) => {
    setIsSearching(false);
    setSelectedPlace(item);
    setSearchTerm(`${item.item.structured_formatting.main_text}`);
    setPredictions([]);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      if (isSearching) {
        console.log('API');
        getPredictions();
      }
      setIsSearching(true);
    } else {
      setPredictions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const inputSearchText = (val: string) => {
    setSearchTerm(val);
  };

  useEffect(() => {
    (async () => {
      getLocation();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedPlace) {
        getPlaceInfo(selectedPlace);
      }
    })();
  }, [selectedPlace]);

  const getPredictions = () => {
    let config = {
      method: 'get',
      url: `${GOOGLE_PLACE_API}${AUTOCOMPLETE}input=${searchTerm}&types=establishment&location=${userLocation?.coords.latitude}%2C${userLocation?.coords.longitude}&origin=${userLocation?.coords.latitude}%2C${userLocation?.coords.longitude}&radius=3000&strictbounds=true&language=ru&key=${TOKEN}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        const pred = response.data;
        setPredictions(pred.predictions);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setUserLocation(position);
      },
      error => {
        Alert.alert(`Code ${error.code}`, error.message);
        setUserLocation(null);
      },
      gpsSettings,
    );
  };

  const getPlaceInfo = (place: IPlace) => {
    const config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.item.place_id}&fields=name,place_id,geometry,address_component,photo&language=ru&key=${TOKEN}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        const res = response.data.result as IPlaceInfo;
        setPlaceInfo(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const PlaceMarker = () => {
    if (placeInfo) {
      return (
        <Marker
          key={placeInfo?.place_id}
          onPress={() => setModalVisible(true)}
          coordinate={{
            latitude: placeInfo?.geometry?.location.lat,
            longitude: placeInfo?.geometry?.location.lng,
          }}
        />
      );
    } else {
      return null;
    }
  };

  const renderItem = (item: IPredictionType) => <PlaceItem item={item} onPressHandler={selectPlace} />;

  const PlaceCard = () => {
    if (placeInfo && selectedPlace) {
      return <PlaceModal setModalVisible={setModalVisible} modalVisible={modalVisible} info={placeInfo} place={selectedPlace} />;
    } else {
      return null;
    }
  };

  if (!userLocation) {
    return (
      <View style={styles.placeWrapper}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <View style={[styles.searchConatiner, predictions[0] ? styles.whiteBackground : styles.transparentBackground]}>
          <SearchBar value={searchTerm} onChangeHandler={inputSearchText} />
          <FlatList
            style={styles.predicationContainer}
            data={predictions}
            renderItem={renderItem}
            keyExtractor={item => String(item.reference)}
          />
        </View>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          mapType={'hybrid'}
          onRegionChangeComplete={e => {
            if (
              e.latitudeDelta.toFixed(6) !== mapDelta.latitudeDelta.toFixed(6) &&
              e.longitudeDelta.toFixed(6) !== mapDelta.longitudeDelta.toFixed(6)
            ) {
              setMapDelta({ latitudeDelta: e.latitudeDelta, longitudeDelta: e.longitudeDelta });
            }
          }}
          initialRegion={{
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: mapDelta.latitudeDelta,
            longitudeDelta: mapDelta.longitudeDelta,
          }}
          followsUserLocation={true}
          zoomEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={false}>
          <PlaceMarker />
        </MapView>
      </View>
      <PlaceCard />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchConatiner: {
    position: 'absolute',
    zIndex: 1000,
    width: windowWidth - Number(StatusBar.currentHeight),
  },
  predicationContainer: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: windowHeight - 20,
    width: windowWidth,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  placeWrapper: {
    alignItems: 'center',
    marginTop: 120,
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
});

export default App;
