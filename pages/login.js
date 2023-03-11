import { Button } from "@mui/material"
import { signInWithPopup } from "firebase/auth"
import Head from "next/head"
import styled from "styled-components"
import { auth, provider } from '../firebase'

function Login() {

  const signIn = () => {
    signInWithPopup(auth, provider)
    .then((result) => console.log(result))
    .catch((error) => alert(error.message))
  }

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo src='https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-whatsapp-icon-png-image_6315990.png' />
        <Button 
          variant="outlined" 
          color="warning"
          onClick={signIn}
        >Sign in with Google</Button>
      </LoginContainer>
    </Container>
  )
}

export default Login

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 14px -3px rgba(0,0,0,0.7);
  transition: all 0.3s ease-in-out;
  :hover {
    box-shadow: 0 4px 24px -3px rgba(0,0,0,0.9);
    
  }
`

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`