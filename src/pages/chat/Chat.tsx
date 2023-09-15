import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from 'api/service/AuthService';
import { UserState } from "store/types/UserActionTypes";
import { relativeTime } from 'common/utils/StringUtils';
import * as StompJs from "@stomp/stompjs";
import "./Chat.scss";

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SendInput from "components/input/SendInput";

interface ChatMessage {
  roomId: string;
  writer?: number;
  message: string;
  date: Date;
}

export default function ChatRoom() {
  const navigate = useNavigate();
  const param = useParams();
  const roomId = param.id;

  const authService = AuthService();

  const [user, setUser] = useState<UserState|undefined>(undefined);
  const [client, setClient] = useState<StompJs.Client | null>(null);
  const [chat, setChat] = useState<string>('');
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const chatViewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (authService.loginRequire()) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      connect(currentUser);
      return () => disConnect();
    }
  }, []);

  useEffect(() => {
    scrollToChatEnd();
  }, [chatList]);

  const connect = (user: UserState | undefined) => {
    try {
      if (roomId && user) {
        const stompClient = new StompJs.Client({
          brokerURL: `${process.env.REACT_APP_WS_BROKER}`,
          debug: function (str: string) {
            // console.log(str);
          },
          connectHeaders: {
            Authorization: 'Bearer ' + user.token,
            RefreshToken: 'Bearer ' + user.refreshToken,
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });
        stompClient.onConnect = function () {
          stompClient.subscribe(`/sub/chat/${roomId}`, callback);
          const body: ChatMessage = {
            roomId: roomId,
            writer: user?.userId,
            message: chat,
            date: new Date()
          }
          stompClient.publish({
            destination: `/pub/chat/${roomId}/join`,
            body: JSON.stringify(body),
          });
        };
        stompClient.activate();
        setClient(stompClient);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const disConnect = () => {
    if (client === null) {
      return;
    }
    client.deactivate();
  };

  const callback = function (message: StompJs.Message) {
    if (message.body) {
      let chat = JSON.parse(message.body) as ChatMessage;
      setChatList((chats) => [...chats, chat]);
    }
  };

  const sendChat = () => {
    if (chat === "" || chat.length === 0) {
      return;
    }
    if (client && user) {
      const body: ChatMessage = {
        roomId: roomId ? roomId : '',
        writer: user.userId,
        message: chat,
        date: new Date()
      }
      client.publish({
        destination: `/pub/chat/${roomId}/send`,
        body: JSON.stringify(body),
      });
    }
    setChat("");
    scrollToChatEnd();
  };

  function scrollToChatEnd() {
    if (chatViewRef.current) {
      chatViewRef.current.scrollTop = chatViewRef.current.scrollHeight;
    }
  }

  function onChangeChat(e: React.ChangeEvent<HTMLInputElement>) {
    setChat(e.target.value);
  };

  return (
    <section className='fullsize'>
      <div className='chat-box'>
        <div className='header-area'>
          <div className='room-title'>Room:{roomId}</div>
          <button className='back-btn'>
            <MoreHorizRoundedIcon/>
          </button>
        </div>
        <div className='message-area scroll' ref={chatViewRef}>
          {chatList.map((item, idx) => {
            if (Number(item.writer) === user?.userId) {
              return (
                <div className='message mine' key={idx}>
                  <span className='time mine'>{relativeTime(item.date)}</span>
                  <div className='contents bubble right mine'>
                    {item.message}
                  </div>
                </div>
              );
            } else if (Number(item.writer) === Number(0)) {
              return (
                <div className='message system' key={idx}>
                  <div className='contents system'>
                    {item.message}
                  </div>
                </div>
              )
            } else {
              return (
                <div className='message' key={idx}>
                  <img src={'https://img.dad-labo.com/user/6/profile/20230823053904.png'} alt="" className="profile"/>
                  <div className='contents bubble left'>
                    {item.message}
                  </div>
                  <span className='time'>{relativeTime(item.date)}</span>
                </div>
              );
            }
          })}
        </div>
        <SendInput className='chat' value={chat} placeholder={'メッセージを入力'} onChange={onChangeChat} submit={sendChat} />
      </div>
    </section>
  );
}