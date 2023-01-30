import React from "react";
import {
  AppBar, Toolbar, Typography
} from "@mui/material";

export default function ButtonAppBar() {

  return (
    <div >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{
            flexGrow: 1,
          }} >
            Photo Guest Book
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
