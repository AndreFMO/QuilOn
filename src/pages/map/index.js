import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { API_BASE_URL } from './../../config';

export function Map() {
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState({
    latitude: -24.4881,
    longitude: -47.8348,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [quilombos, setQuilombos] = useState([]);
  const [selectedQuilombo, setSelectedQuilombo] = useState(null);
  const [informativeData, setInformativeData] = useState(null);
  const [informativeImages, setInformativeImages] = useState([]);

  useEffect(() => {
    fetchQuilombos();
  }, []);

  const fetchQuilombos = () => {
    fetch(`${API_BASE_URL}/quilombos`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao buscar quilombos: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data.quilombos)) {
          const formattedQuilombos = data.quilombos.map(quilombo => ({
            id: quilombo[0],
            name: quilombo[2],
            latitude: parseFloat(quilombo[4].split(',')[0]),
            longitude: parseFloat(quilombo[4].split(',')[1]),
            description: quilombo[5],
            imageUrl: `${API_BASE_URL}/quilomboImage/${quilombo[0]}?t=${new Date().getTime()}`
          }));
          setQuilombos(formattedQuilombos);
        }
      })
      .catch(error => {
        console.error("Erro ao buscar quilombos:", error);
      });
  };

  const handleSearch = () => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`, {
      headers: {
        'User-Agent': 'SeuNomeApp/1.0'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao buscar localização: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          const location = data[0];
          setRegion({
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setMarkerCoordinate({ latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) });
        } else {
          console.warn("Nenhuma localização encontrada.");
        }
      })
      .catch(error => {
        console.error("Erro ao buscar localização:", error);
      });
  };

  const clearSearch = () => {
    setSearchQuery(""); // Limpa a barra de busca
  };

  const fetchInformativeData = (idQuilombo) => {
    fetch(`${API_BASE_URL}/informative/${idQuilombo}`)
      .then(response => response.json())
      .then(data => {
        if (data.population && data.history) {
          setInformativeData(data);
          fetchInformativeImages(idQuilombo);
        } else {
          setInformativeData(null);
        }
      })
      .catch(error => {
        setInformativeData(null);
      });
  };

  const fetchInformativeImages = (idQuilombo) => {
    const imagePromises = [1, 2, 3].map(imageIndex => 
      fetch(`${API_BASE_URL}/informativeImages/${idQuilombo}/${imageIndex}?t=${new Date().getTime()}`)
        .then(response => {
          if (response.ok) return response.url;
          return null;
        })
        .catch(error => null)
    );

    Promise.all(imagePromises)
      .then(images => {
        const filteredImages = images.filter(image => image !== null);
        setInformativeImages(filteredImages);
      })
      .catch(error => console.error("Erro ao buscar imagens:", error));
  };

  const handleMarkerPress = (quilombo) => {
    setSelectedQuilombo(quilombo);
    fetchInformativeData(quilombo.id);
  };

  const closeModal = () => {
    setSelectedQuilombo(null);
    setInformativeData(null);
    setInformativeImages([]);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
      >
        {quilombos && quilombos.map(quilombo => (
          <Marker
            key={quilombo.id}
            coordinate={{latitude: quilombo.latitude, longitude: quilombo.longitude}}
            title={quilombo.name}
            description={quilombo.description}
            pinColor="#D86626"
            onPress={() => handleMarkerPress(quilombo)}
          />
        ))}
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title="New Marker"
          />
        )}
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
              placeholder=""
            />
          </View>
          <TouchableOpacity style={styles.userIcon} onPress={clearSearch}>
            <Text style={styles.x}>×</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedQuilombo}
        onRequestClose={closeModal}
        onShow={fetchQuilombos}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {selectedQuilombo?.imageUrl && (
              <Image
                source={{ uri: selectedQuilombo.imageUrl }}
                style={styles.quilomboImage}
              />
            )}
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedQuilombo?.name}</Text>
              <Text style={styles.description}>{selectedQuilombo?.description}</Text>
              {informativeData && (
                <>
                  <Text style={styles.description}>População: {informativeData.population}</Text>
                  <View style={styles.divider} />
                  {informativeImages.length > 0 && (
                    <View style={styles.imageRow}>
                      {informativeImages.map((imageUrl, index) => (
                        <Image
                          key={index}
                          source={{ uri: imageUrl }}
                          style={styles.informativeImage}
                        />
                      ))}
                    </View>
                  )}
                  <View style={styles.divider} />
                  <Text style={styles.modalSubtitle}>História do Quilombo:</Text>
                  <ScrollView style={styles.scrollView}>
                    <Text style={styles.description}>{informativeData.history}</Text>
                  </ScrollView>
                </>
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    top: '4%',
    left: '5%',
    right: '5%',
    bottom: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  quilomboImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  modalContent: {
    justifyContent: 'center',
    margin: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
  },
  divider: {
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    marginVertical: 10,
    elevation: 1,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Poppins_400Regular',
  },
  scrollView: {
    maxHeight: 150,
  },
  closeButton: {
    backgroundColor: '#D86626',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  informativeImage: {
    width: '28%',
    height: 80,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#000',
    overflow: 'hidden',
  },
});
