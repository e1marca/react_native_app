export enum MessageAuthor {
  MANAGER = "manager",
  USER = "messageable",
}
export interface Message {
  content: string;
  created_at: string;
  created_at_date: string;
  created_at_time: string;
  id: string;
  image: null | Image;
  is_created_today: boolean;
  readed: boolean;
  user_name: string;
  who_wrote: MessageAuthor;
}
export interface Image {
  original: string;
  thumb: string; // 100x100 exact
  preview: string; // 1200x1200 max
  d2000: string; // 2000x2000 max
}

export interface GetMessagesResponse {
  messages: Message[];
  total_count: number;
}

export interface PostMessageRequest {
  content: string;
  image: File;
}

export interface PostMessageResponse {
  message: Message;
  messages: Message[];
}
