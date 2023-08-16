import React, { useEffect, useState } from "react";
import { useRootStore } from "src/hooks/useRootStore";
import { useFetch } from "src/hooks/useFetch";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { NoPlaces } from "./NoPlaces";
import { MyAppText } from "src/shared/Widgets/MyAppText";
import { observer } from "mobx-react-lite";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { useNavigation } from "@react-navigation/core";
import { ProfileScreens, ProfileStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProcessedAddress } from "src/stores/addressStore/types";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { ConfirmModal } from "src/shared/Modals/ConfirmModal";
import { formatAddress } from "src/helpers/functions";

export const Places = observer(() => {
  const {
    addressStore: { getAddresses, addresses, deleteAddress, setInputAddress },
  } = useRootStore();
  const { invokeApi: invokeGetAddress, isLoading: isLoadingAddresses } = useFetch(getAddresses);
  const { invokeApi: invokeDeleteAddress, isLoading: deleteAddressInProcess } = useFetch(deleteAddress);

  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const [addressToDelete, setAddressToDelete] = useState("");

  useEffect(() => {
    invokeGetAddress();
  }, [invokeGetAddress]);

  const handleDeleteAddress = async () => {
    await invokeDeleteAddress(addressToDelete);
    setAddressToDelete("");
  };

  const handlePressEditButton = (address: ProcessedAddress) => {
    const { city, street, dom, kv, entrance, floor, korp, client_comment, location, id } = address;
    setInputAddress({ city, street, dom, kv, entrance, floor, korp, client_comment, location });
    navigation.navigate(ProfileScreens.EDIT_ADDRESS, { id });
  };
  if (isLoadingAddresses || deleteAddressInProcess) {
    return <LoadingIndicator />;
  }

  if (!addresses?.length) {
    return <NoPlaces />;
  }

  const s = StyleSheet.create({
    container: { flex: 1 },
    img: { width: 20, height: 20 },
    deleteBtn: {
      backgroundColor: "#10BBFF",
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
    },
    deleteBtnText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFF",
    },
    addressItem: {
      height: 100,
      backgroundColor: "#FFF",
      marginBottom: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
    },
  });

  return (
    <View style={s.container}>
      <ConfirmModal
        visible={!!addressToDelete}
        title="Удалить адрес?"
        handleCancel={() => setAddressToDelete("")}
        handleConfirm={handleDeleteAddress}
      />
      <View style={{ flex: 5 }}>
        <ScrollView>
          {addresses.map((as, index) => (
            <View key={index} style={{ paddingHorizontal: 10, marginTop: index === 0 ? 10 : 0 }}>
              <View style={s.addressItem}>
                <View style={{ flex: 3 }}>
                  <MyAppText
                    styles={{
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#505050",
                      marginBottom: 5,
                    }}>{`г. ${as?.city}`}</MyAppText>
                  <MyAppText style={{ fontSize: 16, fontWeight: "400", color: "#505050", lineHeight: 24 }}>
                    {formatAddress(as)}
                  </MyAppText>
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
                  <TouchableOpacity onPress={() => handlePressEditButton(as)}>
                    <MyIcon source={require("icons/profileScreen/edit.png")} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAddressToDelete(as.id)}>
                    <MyIcon styles={s.img} source={require("icons/delete.png")} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          width: "100%",
          height: 100,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF",
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ProfileScreens.ADD_ADDRESS)}
          style={{
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F9BE28",
            borderRadius: 10,
            padding: 15,
          }}>
          <MyAppText style={{ fontSize: 18, fontWeight: "600", color: "#FFF" }}>Добавить новый адрес</MyAppText>
        </TouchableOpacity>
      </View>
    </View>
  );
});
