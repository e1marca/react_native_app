import { instance } from "configs/apiConfig";
import { GetMessagesResponse, PostMessageResponse } from "./types";

export const chatService = {
  getMessages: async (): Promise<GetMessagesResponse> => {
    const response = await instance.get<GetMessagesResponse>("/v3/messages");
    return response.data;
  },

  postMessage: async (
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<PostMessageResponse> => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const response = await instance.post<PostMessageResponse>("/v3/messages", formData, {
      headers,
      onUploadProgress,
    });
    return response.data;
  },
};
