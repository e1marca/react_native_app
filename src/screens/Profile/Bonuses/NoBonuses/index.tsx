import React, { FC, useState } from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { MyAppText, FontFamily } from "src/shared/Widgets/MyAppText";
import { EmptyScreen } from "src/shared/Widgets/EmptyScreen";
import { ProfileScreens, ProfileStackParamList } from "../../types";

type NavigationProp = StackNavigationProp<ProfileStackParamList>;

const { BONUSES } = ProfileScreens;

export const NoBonuses: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation<NavigationProp>();

  // новое состояние для отображения модального окна
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigate = () => {
    // navigate(ORDERS);
  };

  // обработчик нажатия на кнопку
  const handleModalOpen = () => {
    setModalVisible(true);
  };

  // обработчик закрытия модального окна
  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          margin: 15,
          backgroundColor: "#fff",
          flex: 0.4,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}>
        <MyAppText style={{ color: "#F9BE28", fontSize: 24, fontWeight: "600", marginBottom: 15 }}>
          0 бонусов
        </MyAppText>
        <MyAppText
          styles={{ color: "#333333", fontSize: 16, fontWeight: "600", fontFamily: FontFamily.SEMIBOLD, opacity: 0.5 }}>
          У вас пока нет бонусов
        </MyAppText>
      </View>
      <EmptyScreen
        imageSource={require("icons/profileScreen/noBonuses.png")}
        handleNavigate={handleModalOpen}
        buttonText={t("Profile:HowToGetBonus") as string}
        styles={{ justifyContent: "flex-start" }}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleModalClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Рядом с ценой каждого товара указано количество баллов, которое вы получите при покупке этого товара.
              Бонусы начисляются после успешной доставки заказа (за отмененные заказы и за заказы, полностью или
              частично оплаченные баллами, бонусы не начисляются).
            </Text>
            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={handleModalClose}>
              <Text style={styles.textStyle}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
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
});
