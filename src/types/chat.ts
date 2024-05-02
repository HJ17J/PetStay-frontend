export interface Chats {
  chatidx: number;
  content: string;
  date: Date;
  img: string;
  authoridx: number;
}

export interface ChatList {
  nickname: string;
  message: string;
  img: string;
}

export interface Room {
  roomidx: number;
  sitteridx: number;
  useridx: number;
  User: User;
}

interface User {
  name: string;
  img: string;
}
