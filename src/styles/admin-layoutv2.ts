import { createStyles } from "@material-ui/core";
import theme from "./theme";

const HEADER_HEIGHT = 72;

/**
 * Styles for admin layout (v2)
 */
export default createStyles({

  content: {
    backgroundColor:  "#e0e0e0",
    width: "100%",
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    overflow: "auto",
    overflowX: "hidden"
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
  }

});
