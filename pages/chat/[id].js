import styled from "styled-components"
import Head from "next/head"
import Sidebar from "@/components/Sidebar";
import ChatScreen from "@/components/ChatScreen";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs, addDoc, 
  setDoc, doc, Timestamp, orderBy, getDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import getRecipientEmail from "@/utils/getRecipientEmail";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth)

  return (
    <Container>
      <Head>
        <title> Chat with {getRecipientEmail(chat.users, user)} </title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context) {
  const ref = doc(db, `chats/${context.query.id}`);

  const messagesRef = collection(ref, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  const messagesRes = await getDocs(q)

  const messages = messagesRes.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    }
  }).map(messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime(),
  }))

  const chatRes = await getDoc(ref);
  const chat = {
    ...chatRes.data(),
    id: chatRes.id,
  }

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    }
  }
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;