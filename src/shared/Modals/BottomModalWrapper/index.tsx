import React from "react";
import { Image, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface BottomModalWrapperProps {
  visible: boolean;
  children: React.ReactElement;
  setVisible: (value: boolean) => void;
}
export const BottomModalWrapper: React.FC<BottomModalWrapperProps> = ({ visible, children, setVisible }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableOpacity activeOpacity={1} onPress={() => setVisible(false)} style={s.centeredView}>
        <TouchableOpacity activeOpacity={1} style={s.modalView}>
          <CloseButton setVisible={setVisible} />
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

interface CloseButtonProps {
  setVisible: (value: boolean) => void;
}
const CloseButton: React.FC<CloseButtonProps> = ({ setVisible }) => {
  return (
    <TouchableOpacity onPress={() => setVisible(false)} style={s.closeButton}>
      <Image source={require("icons/close.png")} />
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  closeButton: { position: "absolute", top: 10, right: 10, padding: 10 },
});
