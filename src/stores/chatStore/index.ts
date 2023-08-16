import { makeAutoObservable, runInAction } from "mobx";
import RootStore from "../rootStore";
import { Message } from "./types";
import { chatService } from "./service";
import { ImagePickerResponse } from "react-native-image-picker";

export class ChatStore {
  public messages: Message[] | null = null;
  public totalMessages: number = 0;

  constructor(private readonly rootStore: RootStore) {
    makeAutoObservable(this);
  }

  public readonly setMessages = (messages: Message[]): void => {
    this.messages = messages;
  };

  public readonly setTotalMessages = (count: number): void => {
    this.totalMessages = count;
  };

  public readonly getMessages = async () => {
    try {
      const response = await chatService.getMessages();
      this.setMessages(response.messages.reverse());
      this.setTotalMessages(response.total_count);
      console.log("fetchMessages", response);
    } catch (error) {
      console.error("fetchMessages", error);
    }
  };

  public readonly sendMessage = async (content: string, image: ImagePickerResponse | null) => {
    try {
      const formData = new FormData();
      formData.append("content", content);

      if (image?.assets![0].uri) {
        const imageObject = {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName,
        };
        formData.append("image", imageObject as any);
      }

      const response = await chatService.postMessage(formData, progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      });
      runInAction(() => this.setMessages(response.messages.reverse()));
    } catch (error) {
      console.error("sendMessage", error);
    }
  };
}
