import { createStyles } from "@material-ui/core";
import theme from "./theme";

const HEADER_HEIGHT = 72;

/**
 * Styles for admin layout (v2)
 */
export default createStyles({

  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    overflow: "auto",
    overflowX: "hidden"
  },

  link: {
    textDecoration: "none"
  },

  appBar:  {
    backgroundColor:  "#333333",
    height: "5rem",
    display: `flex`
  },

  navDisplayFlex:  {
    display: `flex`,
    height: HEADER_HEIGHT,
  },

  navBarLink: {
    color: "#fff",
    display: "flex",
    padding: `0px ${theme.spacing(3)}px`,
    margin: `0px ${theme.spacing(4)}px`,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%"
  },

  activeNavbarLink: {
    color: theme.palette.secondary.main,
    borderBottom: `2px solid ${theme.palette.secondary.main}`
  },

  formLogo: {
    color: theme.palette.secondary.main,
    display: "flex",
    float: "left",
  },

  logoTypography: {
    marginRight: theme.spacing(12),
    fontSize: 32,
    display: "flex"
  },

  saveButtonContainer: {
    marginLeft: "auto",
    marginRight: theme.spacing(1)
  },

  saveButton: {
    color: "#fff",
    borderRadius: 18,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    "&.Mui-disabled": {
      color: "rgba(255, 255, 255, 0.4)"
    }
  },

  metaformSaveLoadingContainer: {
    zIndex: 1200,
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0 ,0, 0, 0.2)"
  },

  metaformLoadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  savingText: {
    marginTop: theme.spacing(1)
  }
});
