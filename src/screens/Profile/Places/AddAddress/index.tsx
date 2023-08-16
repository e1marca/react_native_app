import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, TouchableOpacity, Image, Modal, TextInput, StyleSheet } from "react-native";
import MapView, { Marker, Polygon, UserLocationChangeEvent } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { observer } from "mobx-react-lite";
import { useRootStore } from "src/hooks/useRootStore";
import { useFetch } from "src/hooks/useFetch";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "src/screens/types";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { AlertModal } from "src/shared/Modals/AlertModal";
import { useBackButtonHandler } from "src/hooks/useBackButtonHandler";

interface Coords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapProps {
  addressCoords: Coords;
}

const Map: React.FC<MapProps> = observer(({ addressCoords }) => {
  const [region, setRegion] = useState<Coords>(addressCoords);
  const navigation = useNavigation();

  useEffect(() => {
    setRegion(addressCoords);
  }, [addressCoords]);

  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number }>();

  const handleUserLocationChange = (e: UserLocationChangeEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate!;
    if (latitude !== currentLocation?.latitude || longitude !== currentLocation?.longitude) {
      setCurrentLocation({ latitude, longitude });
    }
  };

  const showCurrentLocation = () => {
    currentLocation && setRegion(prev => ({ ...prev, ...currentLocation }));
  };
  const {
    addressStore: { reverseGeocode, deliveryAvailable, inputAddress, setInputAddress, createAddress },
    authStore: { deliveryZones },
  } = useRootStore();

  const { invokeApi: invokeReverseGeocode } = useFetch(reverseGeocode);
  const { invokeApi: invokeCreateAddress, isLoading: createAddressIsLoading } = useFetch(createAddress);

  const getPolygons = useCallback(() => {
    const polygons = [];
    if (deliveryZones) {
      for (let zones of deliveryZones) {
        for (let zone of zones) {
          const polygon = [];
          for (let coords of zone.coords) {
            polygon.push({ latitude: coords[0], longitude: coords[1] });
          }
          polygons.push(polygon);
        }
      }
    }
    return polygons;
  }, [deliveryZones]);

  const [processed, setProcessed] = useState(false);
  const { kv, entrance, floor, korp } = inputAddress;

  const handleSaveAddress = async () => {
    await invokeReverseGeocode({ lat: region.latitude, lng: region.longitude });
    setProcessed(true);
  };

  const [showAlertAddressAdded, setShowAlertAddressAdded] = useState(false);
  const [showAlertAddressIsntExist, setShowAlertAddressIsntExist] = useState(false);
  const handleBackButton = useBackButtonHandler();

  const handleCreateAddress = async () => {
    setProcessed(false);
    await invokeCreateAddress(inputAddress);
    setShowAlertAddressAdded(true);
  };

  const handleCloseArertAddressAdded = () => {
    setShowAlertAddressAdded(false);
    handleBackButton();
  };
  const handleCloseArertAddressIsntExist = () => {
    setProcessed(false);
    setShowAlertAddressIsntExist(false);
  };

  useEffect(() => {
    if (processed && !deliveryAvailable) {
      setShowAlertAddressIsntExist(true);
    }
  }, [processed, deliveryAvailable]);

  return (
    <View style={{ flex: 1 }}>
      <AlertModal
        title="Доставка по указанному адресу не осуществляется"
        handleConfirm={handleCloseArertAddressIsntExist}
        visible={showAlertAddressIsntExist}
      />
      <AlertModal
        title="Адрес успешно добавлен"
        handleConfirm={handleCloseArertAddressAdded}
        visible={showAlertAddressAdded}
      />
      <Modal animationType="slide" transparent={true} visible={processed && deliveryAvailable}>
        {createAddressIsLoading ? (
          <LoadingIndicator />
        ) : (
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  value={kv}
                  onChangeText={(value: string) => setInputAddress({ kv: value })}
                  placeholder="Квартира"
                />
                <TextInput
                  style={styles.input}
                  value={entrance}
                  onChangeText={(value: string) => setInputAddress({ entrance: value })}
                  placeholder="Подъезд"
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  value={floor}
                  onChangeText={(value: string) => setInputAddress({ floor: value })}
                  placeholder="Этаж"
                />
                <TextInput
                  style={styles.input}
                  value={korp}
                  onChangeText={(value: string) => setInputAddress({ korp: value })}
                  placeholder="Корпус"
                />
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={handleCreateAddress}
                  style={{
                    padding: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#10BBFF",
                    width: "100%",
                    borderRadius: 10,
                    marginBottom: 10,
                  }}>
                  <MyAppText
                    styles={{ fontWeight: "600", fontSize: 18, fontFamily: FontFamily.SEMIBOLD, color: "#FFF" }}>
                    Сохранить
                  </MyAppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setProcessed(false)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}>
                  <MyAppText
                    styles={{ fontWeight: "600", fontSize: 18, fontFamily: FontFamily.SEMIBOLD, color: "#919191" }}>
                    Отменить
                  </MyAppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
      <MapView
        showsMyLocationButton={false}
        onUserLocationChange={handleUserLocationChange}
        followsUserLocation
        showsUserLocation
        provider={"google"}
        style={{ flex: 1 }}
        region={region}>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
        {getPolygons().map((polygonCoordinates, index) => (
          <Polygon key={index} coordinates={polygonCoordinates} fillColor="rgba(100, 100, 200, 0.3)" />
        ))}
      </MapView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: "20%",
          padding: 10,
          right: "1%",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={showCurrentLocation}>
        <MyIcon source={require("icons/profileScreen/target.png")} />
      </TouchableOpacity>
      <View style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
        <TouchableOpacity
          onPress={handleSaveAddress}
          style={{
            padding: 15,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#10BBFF",
            width: "100%",
            borderRadius: 10,
          }}>
          <MyAppText style={{ fontWeight: "600", fontSize: 18, fontFamily: FontFamily.SEMIBOLD, color: "#FFF" }}>
            Добавить адрес
          </MyAppText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#27C1FE",
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 5,
    padding: 20,
    width: "47%",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

interface AddressSearchProps {
  onSearch: (coords: Coords) => void;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onSearch }) => {
  return (
    <View
      style={{
        zIndex: 1,
        position: "absolute",
        top: 10,
        left: 10,
        right: 10,
      }}>
      <GooglePlacesAutocomplete
        placeholder="Найти адрес"
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details && details.geometry) {
            onSearch({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        }}
        query={{
          key: "AIzaSyC1RGVwxD-VBN8_XqJpuzt_jBcTXCvMqGI",
          language: "ru",
        }}
      />
    </View>
  );
};

export const AddAddress = observer(() => {
  const [coords, setCoords] = useState<Coords>({
    latitude: 44.78825,
    longitude: 44.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  return (
    <View style={{ flex: 1 }}>
      <AddressSearch onSearch={setCoords} />
      <Map addressCoords={coords} />
    </View>
  );
});
