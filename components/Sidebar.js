import { useState } from "react";
import styled from "styled-components";
import Avatar from '@mui/material/Avatar';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton, TextField, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import * as EmailValidator from 'email-validator';
import { signOut } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from '../firebase'
import { collection, query, where, getDocs, addDoc, 
  setDoc, doc, Timestamp } from "firebase/firestore"
import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = query(
    collection(db, "chats"), 
    where("users", "array-contains", user.email)
  );
  const [chatsSnapshot] = useCollection(userChatRef);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () =>{
    setEmail("");
    setEmailEmpty(false);
    setEmailError(false);
    setEmailExists(false);
    setOpen(false);
  }

  const createChat = () => {
    if (!email) {
      setEmailEmpty(true);
      return;
    } else {
      setEmailEmpty(false);
    }
    if(!EmailValidator.validate(email)) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }
    if (chatAlreadyExists(email)) {
      setEmailExists(true);
      return;
    } else {
      setEmailExists(false);
    }
    const input = email.trim();
    if (!input) return null;
    if (EmailValidator.validate(input) && !chatAlreadyExists(input)
    && input !== user.email) {
      addDoc(collection(db, "chats"), {
        users: [user.email, input],
      });
    }
  }

  const chatAlreadyExists = (recipientEmail) => {
    return !!chatsSnapshot?.docs.find((chat) =>
      chat.data().users.find((user) => user === recipientEmail)?.length > 0
  )};

  return (
    <Container>
      <Header>
      {user.photoURL?
        <Avatar src={user.photoURL} onClick={()=>signOut(auth)}/>
        :
        <Avatar onClick={()=>signOut(auth)}>{user.email[0]}</Avatar>
      }
        <IconsContainer>
          <IconButton>
            <ChatIcon style={{color: "black"}} />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{color: "black"}} />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in messages"/>
      </Search>
      <SidebarButton variant="text" onClick={handleClickOpen} >
        Start a new conversation
      </SidebarButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a new chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please enter the email address of the person you wish to chat with:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            error={emailEmpty || emailError || emailExists}
            helperText={ 
              emailEmpty ? "Please enter an email address" : 
              emailError ? "Please enter a valid email address" :
              emailExists ? "This email address is already in your chat list" : ""
            }
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => createChat()}>Create</Button>
        </DialogActions>
      </Dialog>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
      
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; // IE and Edge
  scrollbar-width: none; // Firefox
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  color: black;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div`

`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    //border-top: 1px solid whitesmoke;
    //border-bottom: 1px solid whitesmoke;
  }
`;

