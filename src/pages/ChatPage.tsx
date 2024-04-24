import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import socket from "../types/socket";
import axios from "axios";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.imageUrl; // 서버가 이미지 URL을 반환한다고 가정
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const sendMessage = async () => {
    let imageUrl = "";

    if (image) {
      imageUrl = await uploadImage(image);
    }

    const newMessage = {
      chatIdx: messages.length + 1,
      content: message,
      date: new Date(),
      img: imageUrl,
      authorIdx: 1, // 사용자 인덱스 처리 필요
    };

    socket.emit("sendMessage", newMessage);
    setMessage("");
    setImage(null);
  };

  return (
    <div>
      <h1>채팅방</h1>
      <ul>
        {messages.map((msg) => (
          <li key={msg.chatIdx}>
            {msg.content}
            {msg.img && (
              <img src={msg.img} alt="Chat Image" style={{ width: 100 }} />
            )}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatPage;
