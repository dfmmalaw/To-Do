import React from "react";
import {
  CircularProgress,
  Dialog,
  Stack,
  styled,
  Typography,
} from "@mui/material";

const ThemeBackdrop = styled(Dialog)(
  ({ theme }) => `
  .MuiDialog-paper {

      width: 150px;
      height: 150px;
      display: flex;
      justify-content: center;
      box-shadow: none;
    }
  `
);

export default function SimpleBackdrop(status) {
  return (
    <div>
      <ThemeBackdrop
        open={status}
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
        // fullWidth
        // sx={{ width: "100px", height: "100px" }}
      >
        <Stack gap={1} justifyContent="center" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography>Loading...</Typography>
        </Stack>
      </ThemeBackdrop>
    </div>
  );
}
