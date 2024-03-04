import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#75E6A4",
      
    },
    // secondary: {
    //   main: "#ffffff",
    // },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            outline: "none",  
          },
        },
      },
    },
  },
});
