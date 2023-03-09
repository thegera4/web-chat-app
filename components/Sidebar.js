import styled from "styled-components";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from "@mui/material";

function Sidebar() {

  return (
    <Container>
      <Header>
        <UserAvatar />
        <IconsContainer>
          <IconButton>
            <ChatIcon style={{color: "black"}} />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{color: "black"}} />
          </IconButton>
        </IconsContainer>
      </Header>
    </Container>
  )
}

export default Sidebar

const Container = styled.div`

`;

const Header = styled.div`

`;

const UserAvatar = styled(AccountCircleIcon)`
  color: black;
`;

const IconsContainer = styled.div`

`;

