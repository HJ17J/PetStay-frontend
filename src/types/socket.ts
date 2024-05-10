import { io } from "socket.io-client";
import store from "../store/store";
import { receiveMessage } from "../store/chatSlice";

const socket = io("http://localhost:3000");
socket.on("newMessage", (message) => {
  store.dispatch(receiveMessage(message));
});

export default socket;
