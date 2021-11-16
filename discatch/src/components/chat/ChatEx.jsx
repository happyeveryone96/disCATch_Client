import React, { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../../redux/modules/chat";
import { pushChatMessage } from "../../redux/modules/chat";
import styled from "styled-components";
import { Image } from "../../elements";
import moment from "moment";

const ChatEx = (props) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const ChatInfo = useSelector((state) => state.chat.chatinfo);
  const LastMessages = useSelector((state) => state.chat.chatmessage);
  const username = useSelector((state) => state.mypage.userInfo.username);
  const NickName = useSelector((state) => state.mypage.userInfo.nickname);
  const client = useRef({});

  const [message, setMessage] = useState("");
  const commentsEndRef = useRef(null);
  // 댓글 스크롤 밑으로 이동
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "auto" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [LastMessages]);

  useEffect(() => {
    dispatch(chatActions._getAllMessage(props.roomId));
    dispatch(chatActions._getRoomInfo(props.roomId));
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const connect = () => {
    client.current = new StompJs.Client({
      // brokerURL: "ws://localhost:8080/ws-stomp/websocket", // 웹소켓 서버로 직접 접속
      webSocketFactory: () => new SockJS("http://52.78.241.50/ws-stomp"), // proxy를 통한 접속
      connectHeaders: {
        token: token,
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });

    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const subscribe = () => {
    client.current.subscribe(
      `/sub/chat/room/${props.roomId}`,
      function (response) {
        const res = JSON.parse(response.body);
        // const createdAt = moment(res.createdAt).format("YYYY. M. D HH:mm:ss");
        // const hourDiff = moment(createdAt).diff(moment(), "hours");
        // // format 1, 수정한 지 하루 경과했을 경우 : YYYY.MM.DD hh:mm
        // const updated = moment(createdAt).format(" YYYY. M. D hh:mm");
        // // format 2, 수정한 지 하루 이내일 경우 : 'n 분 전, n 시간 전'
        // const recentlyUpdated = moment(createdAt).fromNow();
        // const sendtime = hourDiff < -22 ? { recentlyUpdated } : { updated };
        // console.log(res.createdAt);
        const message = {
          message: res.message,
          sender: res.userName,
          time: res.createdAt,
          mine: null,
        };
        dispatch(pushChatMessage(message));
      }
    );
  };

  const publish = (message) => {
    if (!client.current.connected) {
      return;
    }

    client.current.publish({
      destination: "/pub/api/chat/message",
      headers: { token: token },
      body: JSON.stringify({
        message: message,
        roomId: props.roomId,
        userName: username,
      }),
    });

    setMessage("");
  };

  return (
    <ChatWrap>
      <ChatBody>
        <Header>
          {/* <button class="back-btn">
          <img src="imgs/left-arrow.png" width="30" height="30">  
        </button> */}
          <Image
            width="40px"
            height="40px"
            borderRadius="20px"
            src={ChatInfo.opponentImage}
            alt={ChatInfo.opponentImage}
          />
          <InfoBlock>
            <p>{ChatInfo.opponent}</p>
            <p>{ChatInfo.lastActivity}에 활동</p>
          </InfoBlock>
          {/* <CallBox></CallBox> */}
        </Header>
        {LastMessages ? (
          <ChatBox>
            {LastMessages.map((lastmessage, idx) => {
              return (
                <div key={idx}>
                  {lastmessage.sender === NickName ? (
                    <BubbleBox user="my">
                      <p>{lastmessage.time}</p>
                      <Bubble user="my">{lastmessage.message} </Bubble>
                    </BubbleBox>
                  ) : (
                    <BubbleBox user="friend">
                      <Bubble user="friend">{lastmessage.message} </Bubble>
                      <p>{lastmessage.time}</p>
                    </BubbleBox>
                  )}
                </div>
              );
            })}
          </ChatBox>
        ) : (
          ""
        )}
        <div ref={commentsEndRef} />
      </ChatBody>
      <ChatSendBox>
        <ChatInput
          type={"text"}
          placeholder={"채팅을 입력해주세요!"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.which === 13 && publish(message)}
        />
        <SendButton onClick={() => publish(message)}>
          <SendText>
            <p>전송</p>
          </SendText>
        </SendButton>
      </ChatSendBox>
    </ChatWrap>
  );
};

const ChatWrap = styled.div`
  width: 95%;
  height: 95%;
  overflow: auto;
  margin: auto;
  overflow-x: hidden;
`;
const ChatBody = styled.div`
  min-height: 480px;
  background: #fefdf8;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #fefdf8;
  width: 95%;
  display: flex;
  height: 60px;
  padding: 10px 5px 0px 5px;
  z-index: 1000;
  position: fixed;
`;

const InfoBlock = styled.div`
  margin-left: 12px;
  margin-right: 95px;
  p {
    :nth-child(1) {
      margin: 0 0 3px;
      font-size: 16px;
    }
    :nth-child(2) {
      margin: 0;
      font-size: 12px;
      color: #999999;
    }
  }
`;

const CallBox = styled.div`
  display: flex;
  width: 60px;
  justify-content: space-between;
`;

const ChatBox = styled.div`
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const BubbleBox = styled.div`
  margin: 5px 0px;
  display: flex;
  ${(props) =>
    props.user === "my"
      ? `
      justify-content:flex-end;
    `
      : ``}
  p {
    display: flex;
    font-size: 10px;
    margin: 10px 5px;
    align-items: end;
  }
`;

const Bubble = styled.div`
  margin: 5px 0;
  display: inline-block;
  max-width: 300px;
  font-size: 14px;
  position: relative;
  ${(props) =>
    props.user === "my"
      ? `
      background-color: #cbcf52;
      border-radius: 14px 14px 14px 0;
      padding: 7px 15px 7px 15px;
      float: right;
      clear: both;
      color: #000000;`
      : `
      background-color: #fbd986;
      border-radius: 14px 14px 14px 0;
      padding: 7px 15px 7px 15px;
      float: left;
      clear: both;
      color: #000000;`}
`;
const ChatSendBox = styled.div`
  display: flex;
  align-items: flex-end;
  background: #fefdf8;
  width: 90%;
  height: 80px;
  padding: 10px;
  border: 1px solid #cbcf52;
  border-radius: 10px;
  margin: auto;
  // position: fixed;
  z-index: 1200;
`;
const ChatInput = styled.input`
  position: relative;
  display: flex;
  width: 85%;
  height: 60px;
  margin: auto;
  background: #fefdf8;
  resize: none;
  border: none;
`;
const SendText = styled.div`
  position: relative;
  width: 100%;
  height: 30px;
  background: #fbd986;
  display: flex;
  jutify-content: center;
  border-radius: 10px;
  p {
    font-size: 14px;
    font-weight: 900;
    margin: auto;
    text-align: center;
  }
`;

const SendButton = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
`;

export default ChatEx;
