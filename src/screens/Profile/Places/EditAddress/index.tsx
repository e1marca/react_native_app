import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { observer } from "mobx-react-lite";
import { useRootStore } from "src/hooks/useRootStore";
import { useFetch } from "src/hooks/useFetch";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { ProfileScreens, ProfileStackParamList } from "../../types";
import { AlertModal } from "src/shared/Modals/AlertModal";

export const EditAddress = observer(() => {
  const {
    addressStore: { inputAddress, setInputAddress, updateAddress },
  } = useRootStore();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ProfileStackParamList, ProfileScreens.EDIT_ADDRESS>>();
  const {
    params: { id },
  } = route;

  const [modalVisisible, setModalVisible] = useState(false);
  const { invokeApi: invokeUpdateAddress, isLoading: updateAddressIsLoading } = useFetch(updateAddress);
  const { kv, entrance, floor, korp, location } = inputAddress;

  const handleUpdateAddress = async () => {
    await invokeUpdateAddress(id);
    setModalVisible(true);
  };
  const handleConfirm = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <AlertModal title="Адрес успешно изменен" handleConfirm={handleConfirm} visible={modalVisisible} />
      <MapView
        showsMyLocationButton={false}
        provider={"google"}
        style={{ flex: 3 }}
        region={{
          latitude: location.lat!,
          longitude: location.lng!,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}>
        <Marker coordinate={{ latitude: location.lat!, longitude: location.lng! }} />
      </MapView>
      <View style={{ flex: 2 }}>
        {updateAddressIsLoading ? (
          <LoadingIndicator />
        ) : (
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
            <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40%",
                  borderRadius: 10,
                }}>
                <MyAppText
                  styles={{ fontWeight: "600", fontSize: 18, fontFamily: FontFamily.SEMIBOLD, color: "#E7E7E7" }}>
                  Отменить
                </MyAppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleUpdateAddress()}
                style={{
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#10BBFF",
                  width: "55%",
                  borderRadius: 10,
                  marginBottom: 10,
                }}>
                <MyAppText style={{ fontWeight: "600", fontSize: 18, fontFamily: FontFamily.SEMIBOLD, color: "#FFF" }}>
                  Изменить адрес
                </MyAppText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  modalView: {
    width: "100%",
    backgroundColor: "#FFF",
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
    padding: 10,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 5,
    padding: 15,
    width: "47%",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
