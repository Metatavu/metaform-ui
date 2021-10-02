import { createMuiTheme } from "@material-ui/core";

const { breakpoints } = createMuiTheme();

export default createMuiTheme({

  palette: {
    primary: {
      main: "#2196F3"
    },
    secondary: {
      main: "#F9473B",
      light: "#39a849"
    },
    text: {
      primary: "#333333",
      secondary: "#ffffff"
    },
    background: {
      default: "#f2f2f2",
      paper: "#ffffff"
    }
  },

  typography: {
    allVariants: {
      fontFamily: "poppins, sans-serif"
    },
    h1: {
      fontWeight: 600,
      fontSize: 22,
      [breakpoints.down("sm")]: {
        fontSize: "1.75rem"
      }
    },
    h2: {
      fontWeight: 600,
      fontSize: 20
    },
    h3: {
      fontWeight: 100,
      fontSize: 20
    },
    h4: {
      fontWeight: 100,
      fontSize: 20,
      color: "rgba(0, 0, 0, 0.5)",
      fontStyle: "italic",
      paddingLeft: 16
    },
    body1: {
      fontSize: 14
    },
    h5: {
      fontSize: 16
    },
    h6: {
      fontSize: 12
    },
    body2: {
      fontSize: 14,
    }
  },

  props: {
    MuiAppBar: {
      elevation: 0,
      position: "fixed"
    },
    MuiTextField: {
      variant: "outlined",
      size: "small"
    }
  },

  overrides: {
    MuiAppBar: {
      root: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
      },
      colorPrimary: {
        backgroundColor: "#000"
      }
    },
    MuiDrawer: {
      paper: {
        width: 300
      }
    },
    MuiRadio: {
      root: {
        color: "rgba(0, 0, 0, 0.54)"
      }
    },
    MuiFormControl: {
      root: {
        width: "100%"
      }
    },
    MuiToolbar: {
      root: {
        alignItems: "center",
        minHeight: "72px !important",
        width: "100%"
      }
    },
    MuiButton: {
      root: {
        borderRadius: 20
      }
    },
    MuiFormLabel: {
      root: {
        color: "rgba(0, 0, 0, 0.54)",
        marginBottom: 8
      }
    },
    MuiDivider: {
      root: {
        width: "100%"
      }
    },
    MuiIconButton: {
      root: {
        paddingTop: "0px !important",
        paddingBottom: "0px !important"
      }
    }
  }
});