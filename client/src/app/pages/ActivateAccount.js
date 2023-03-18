import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Container,
  Button,
  styled,
  Avatar,
  Collapse,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import { activateAccount } from "../redux/actions/auth.action";
import BackDrop from "../components/Backdrop";

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

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.success};
      top: -${theme.spacing(6)};
      position: absolute;
      left: 50%;
      margin-left: -${theme.spacing(6)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

function ConfirmEmail() {
  const isLoading = useSelector((state) => state.loading.loader);

  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(true);
  const [last, setLast] = useState(false);

  const handleSubmit = () => {
    dispatch(activateAccount(token, navigate));
  };

  return (
    <>
      {BackDrop(isLoading)}
      <Box
        component="div"
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MainContent>
          <Container maxWidth="sm">
            <Card
              sx={{
                position: "relative",
                overflow: "visible",
              }}
            >
              <Box
                sx={{
                  px: 4,
                  pb: 4,
                  pt: 10,
                }}
              >
                <AvatarSuccess>
                  <CheckTwoToneIcon />
                </AvatarSuccess>

                <Collapse in={openAlert}>
                  <Alert
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenAlert(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    severity="info"
                  >
                    Please activate account
                  </Alert>
                </Collapse>

                <Typography
                  align="center"
                  sx={{
                    py: 4,
                  }}
                  variant="h3"
                >
                  Please press the button to activate your account
                </Typography>

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  startIcon={last && <CircularProgress size="1rem" />}
                  disabled={last}
                  onClick={handleSubmit}
                >
                  Activate
                </Button>
              </Box>
            </Card>
          </Container>
        </MainContent>
      </Box>
    </>
  );
}

export default ConfirmEmail;
