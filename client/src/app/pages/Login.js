import {
  Box,
  Container,
  styled,
} from "@mui/material";
import LoginWithOtherProvider from "./LoginWithOtherProvider";

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function Login() {
  return (
    <Box
      component="div"
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MainContent>
        <Container sx={{ pl: 0, pr: 0 }} maxWidth="sm">
          <LoginWithOtherProvider />
        </Container>
      </MainContent>
    </Box>
  );
}

export default Login;