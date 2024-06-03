import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

export function Map() {
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState({
    latitude: -24.4881,
    longitude: -47.8348,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const handleSearch = () => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const location = data[0];
          setRegion({
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setMarkerCoordinate({latitude: parseFloat(location.lat), longitude: parseFloat(location.lon)});
        }
      })
      .catch(error => console.warn(error));
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        {markerCoordinate && <Marker coordinate={markerCoordinate} />}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.searchArea}>
          <View style={styles.searchContainer}>
            <Image source={require('./../../assets/search-icon.png')} style={styles.searchIcon} /> 
            <TextInput
              style={styles.input}
              onChangeText={setSearchQuery}
              value={searchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.userIcon} onPress={handleSearch}>
            <Text style={styles.x}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: '8%',
    left: '5%',
    right: '5%',
    bottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold'
  },
  searchArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "80%",
    height: "75%",
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 40,
    backgroundColor: "#FFFF",
    elevation: 5,
  },
  searchIcon: {
    marginHorizontal: 2,
    width: 18,
    height: 18,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    marginBottom: -3,
  },
  userIcon: {
    backgroundColor: "#FFF",
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    marginBottom: 18,
    elevation: 5,
  },
  x: {
    fontSize: 32,
    marginTop: -2,
    textAlign: "center",
  },
});
