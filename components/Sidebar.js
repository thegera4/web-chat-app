import styled from "styled-components";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton } from "@mui/material";
import * as EmailValidator from 'email-validator';
import { signOut } from "firebase/auth"
import { auth } from '../firebase'

function Sidebar() {

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );

    if (!input) return null;

    if (EmailValidator.validate(input)) {
      // We need to add the chat into the DB 'chats' collection 
      
    }


  }

  return (
    <Container>
      <Header>
        <UserAvatar onClick={()=>signOut(auth)}/>
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
      <SidebarButton
        onClick={() => createChat()}
      >Start a new conversation</SidebarButton>
      
    </Container>
  )
}

export default Sidebar

const Container = styled.div`

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

const UserAvatar = styled(AccountCircleIcon)`
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
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

