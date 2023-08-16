import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { MyAppText } from "../../Widgets/MyAppText";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, title, handleConfirm, handleCancel }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={s.modalContainer}>
        <View style={s.modalWindow}>
          <MyAppText style={s.modalHeader}>{title}</MyAppText>
          <View style={s.modalButtonsWrapper}>
            <TouchableOpacity style={s.cancelBtn} onPress={handleCancel}>
              <MyAppText style={s.cancelBtnText}>Отмена</MyAppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={s.deleteBtn}>
              <MyAppText style={s.deleteBtnText}>Подтвердить</MyAppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const s = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWindow: {
    width: "80%",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#404040",
    marginBottom: 15,
  },
  modalButtonsWrapper: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cancelBtn: { justifyContent: "center" },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#505050",
  },
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
});
