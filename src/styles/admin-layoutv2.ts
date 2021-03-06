import { createStyles } from "@material-ui/core";

/**
 * Styles for admin layout (v2)
 */
export default createStyles({

  root: {
    display: "flex",
    backgroundColor:  "#e0e0e0"
  },
  appBar:  {
    backgroundColor:  "#333333",
    height: "5rem",
    display: `flex`
  },
  navDisplayFlex:  {
    display: `flex`,
    justifyContent: `space-between`  
  },
  navBarLink: {
    color: "#fff",
    paddingRight: "2rem",
    paddingLeft: "2rem",
    marginLeft: "1.5rem",
    marginRight: "1.5rem",
    display: "inline",
    textAlign: "center"
  },
  formLogo: {
    color: "#e16928",
    display: "flex",
    float: "left",
  },
  toolBar: {
    justifyContent: "left",
    whiteSpace: "nowrap"
  },
  logoTypography: {
    marginRight: "15%"
  }

});
