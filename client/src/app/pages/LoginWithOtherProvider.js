import {
  Button,
  Card,
  CircularProgress,
} from "@mui/material";

import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {
  const {
    loginWithRedirect,
    isLoading,
  } = useAuth0();
  return (
    <Card
      sx={{
        mt: 3,
        p: 4,
      }}
    >
      <form noValidate>
        <Button
          sx={{ marginTop: 3 }}
          startIcon={isLoading ? <CircularProgress size="1rem" /> : null}
          disabled={Boolean(isLoading)}
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          onClick={() => loginWithRedirect()}
          data-testid="submit"
        >
          Sign in with Auth0
        </Button>
      </form>
    </Card>
  );
};

export default LoginPage;
