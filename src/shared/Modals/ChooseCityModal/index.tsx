import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontFamily, MyAppText } from "../../Widgets/MyAppText";
import { observer } from "mobx-react-lite";
import { useRootStore } from "src/hooks/useRootStore";
import { useFetch } from "src/hooks/useFetch";

export const ChooseCityModal = observer(() => {
  const {
    authStore: {
      currentCity,
      setCity,
      mobileToken: {
        company_info: { city_branches },
      },
    },
  } = useRootStore();

  const { invokeApi: invokeSetCity } = useFetch(setCity);

  return (
    <Modal transparent animationType="fade" visible>
      <View style={s.modalContainer}>
        <View style={s.modalWindow}>
          <MyAppText style={s.modalHeader}>Выберите город</MyAppText>
          <View>
            {city_branches.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[s.button, currentCity === c.title && s.activeButton]}
                onPress={() => invokeSetCity(c.id)}>
                <MyAppText style={{ ...s.buttonText, ...(currentCity === c.title && s.activeButtonText) }}>
                  {c.title}
                </MyAppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
});
const s = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWindow: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "500",
    color: "#0E0D0D",
    marginBottom: 35,
    textAlign: "center",
    fontFamily: FontFamily.BOLD,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#10BBFF",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#10BBFF",
    fontFamily: FontFamily.MEDIUM,
  },
  activeButton: {
    backgroundColor: "#10BBFF",
  },
  activeButtonText: { color: "#FFF" },
});
