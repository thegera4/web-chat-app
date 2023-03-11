import { CircularProgress } from '@mui/material'

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <img 
        src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" 
        alt="loading" 
        style={{ marginBottom: 10 }}
        height={100}
      />
      <CircularProgress color="#3CBC2B" size={60} />
    </center>
  )
}

export default Loading