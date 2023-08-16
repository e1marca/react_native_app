import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageURISource,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFetch } from "src/hooks/useFetch";
import { useRootStore } from "src/hooks/useRootStore";
import { LoadingIndicator } from "src/shared/Widgets/LoadingIndicator";
import { FontFamily, MyAppText } from "src/shared/Widgets/MyAppText";
import { ImagePickerResponse, launchImageLibrary } from "react-native-image-picker";
import { MyIcon } from "src/shared/Widgets/MyIcon";
import { Message, MessageAuthor } from "src/stores/chatStore/types";
import ImageView from "react-native-image-viewing";
const width = Dimensions.get("window").width;

export const ChatWithManager = observer(() => {
  const {
    chatStore: { getMessages, sendMessage, messages },
  } = useRootStore();
  const { invokeApi, isLoading } = useFetch(getMessages);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setImage] = useState<ImagePickerResponse | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [inputHeight, setInputHeight] = useState(50);
  const { invokeApi: invokeSendMessage, isLoading: isMessageSending } = useFetch(sendMessage);

  const single_check_mark = require("icons/profileScreen/single_check_mark.png");
  const double_check_marks = require("icons/profileScreen/double_check_marks.png");

  const selectPhotoTapped = async () => {
    await launchImageLibrary(
      {
        selectionLimit: 1,
        mediaType: "mixed",
      },
      response => {
        if (response.didCancel) {
          console.log("User cancelled photo picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorCode);
        } else {
          setImage(response);
        }
      }
    );
  };
  const handleSendMessage = async () => {
    await invokeSendMessage(inputText.trim(), selectedImage);
    setInputText("");
    setImage(null);
    if (flatListRef.current && !isLoading) {
      flatListRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  };

  useEffect(() => {
    invokeApi();
  }, []);

  const [imageForView, setImageForView] = useState<ImageURISource[]>([]);

  if (isLoading) {
    return <LoadingIndicator />;
  }
  return (
    <View style={styles.chatContainer}>
      {isMessageSending && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.1)",
            zIndex: 100,
          }}>
          <LoadingIndicator />
        </View>
      )}
      <ImageView
        images={imageForView}
        imageIndex={0}
        visible={!!imageForView.length}
        onRequestClose={() => setImageForView([])}
      />
      <FlatList
        inverted
        ref={flatListRef}
        data={messages}
        renderItem={({ item }: { item: Message }) => {
          const { id, who_wrote, content, created_at, readed, image, is_created_today, created_at_time } = item;
          return (
            <View
              key={id}
              style={[
                styles.messageBox,
                who_wrote === MessageAuthor.MANAGER ? styles.managerMessage : styles.userMessage,
              ]}>
              <View
                style={[
                  styles.userMessageTextWrapper,
                  who_wrote === MessageAuthor.MANAGER ? styles.managerMessageContent : styles.userMessageContent,
                ]}>
                {image && (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setImageForView([{ uri: image.original }])}>
                    <Image style={{ width: width * 0.5, height: width * 0.5 }} source={{ uri: image.preview }} />
                  </TouchableOpacity>
                )}
                <MyAppText style={styles.messageContent}>{content}</MyAppText>
              </View>
              <View style={styles.messageInfo}>
                <Text style={styles.date}>{is_created_today ? created_at_time : created_at}</Text>
                {who_wrote === MessageAuthor.USER && (
                  <MyIcon
                    styles={{ width: 16, height: 16, tintColor: "#06BC7D" }}
                    source={readed ? double_check_marks : single_check_mark}
                  />
                )}
              </View>
            </View>
          );
        }}
      />
      <View style={[styles.inputContainer]}>
        {selectedImage && (
          <View
            style={{
              width: width * 0.3,
              height: width * 0.3,
              position: "absolute",
              bottom: inputHeight + 30,
              zIndex: 10,
              backgroundColor: "#FFF",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              borderRadius: 5,
            }}>
            <Image
              style={{ width: width * 0.25, height: width * 0.25, resizeMode: "center" }}
              source={{ uri: selectedImage.assets![0].uri }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setImage(null)}
              style={{
                position: "absolute",
                top: -14,
                right: -14,
                padding: 7,
                backgroundColor: "#D9D9D9",
                borderRadius: 100,
              }}>
              <MyIcon source={require("icons/close.png")} styles={{ tintColor: "#000", width: 12, height: 12 }} />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          onPress={selectPhotoTapped}
          style={{ padding: 12, backgroundColor: "#F4F4F4", borderRadius: 100 }}>
          <MyIcon source={require("icons/profileScreen/addImage.png")} />
        </TouchableOpacity>
        <TextInput
          style={[styles.inputField, { height: inputHeight }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Введите ваше сообщение..."
          multiline={true}
          onContentSizeChange={e => {
            setInputHeight(e.nativeEvent.contentSize.height);
          }}
        />
        <TouchableOpacity onPress={handleSendMessage} style={{ padding: 5 }} disabled={!inputText && !selectedImage}>
          <MyIcon source={require("icons/profileScreen/send.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageBox: {
    alignSelf: "flex-start",
    maxWidth: "70%",
    marginBottom: 10,
  },
  managerMessage: {
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  userMessageTextWrapper: { borderRadius: 20, padding: 10 },
  messageContent: {
    color: "#333",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FontFamily.MEDIUM,
  },
  managerMessageContent: { backgroundColor: "#FFF", borderBottomLeftRadius: 0 },
  userMessageContent: { backgroundColor: "#E5EEFD", borderBottomRightRadius: 0 },
  messageInfo: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 5,
  },
  date: {
    marginRight: 5,
    fontSize: 12,
    color: "#333",
  },
  readTicks: {
    color: "red",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#FFF",
    borderRadius: 30,
  },
  inputField: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
