import { useState, useRef } from "react";
import styled from "styled-components"
import { useAuthState } from "react-firebase-hooks/auth"
import { db, auth } from "../firebase"
import { useRouter } from "next/router";
import { Avatar } from "@mui/material";
import { IconButton } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { collection, query, orderBy, doc, updateDoc, addDoc, 
  serverTimestamp, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);

  const messagesCollection = collection(db, "chats", router.query.id, "messages");
  const messagesQuery = query(messagesCollection, orderBy("timestamp", "asc"));
  const [messagesSnapshot] = useCollection(messagesQuery)

  const recipientCollection = collection(db, "users");
  const recipientQuery = query(recipientCollection, where("email", "==", getRecipientEmail(chat.users, user)));
  const[recipientSnapshot] = useCollection(recipientQuery);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message 
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ))
    }
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  const sendMessage = async (e) => {  
    e.preventDefault();

    // Update the last seen
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      lastSeen: serverTimestamp(),
    })

    // Add the message to the DB collection
    await addDoc(collection(doc(db, "chats", router.query.id), "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })

    setInput("");
    scrollToBottom();
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {
            recipientSnapshot ? (
            <p>Last active: {" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : "Unavailable" }
            </p>
          ) : ( <p>Loading last active...</p> )
          }
          
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef}/>
      </MessageContainer>
      <InputContainer>
        <EmojiEmotionsIcon
          style={{ color: "#ffcb4c" }}
        />
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}> Send Message </button>
        <MicIcon color="primary" />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 87px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  align-items: center;
  padding: 20px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  border: none;
  outline: none;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
`;