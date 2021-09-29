import { createStyles } from "@material-ui/core";
import theme from "./theme";

/**
 * Styles for preview screen
 */
export default createStyles({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: `${theme.spacing(4)}px 0px`
  },

  formContainer: {
    padding: theme.spacing(6),
    backgroundColor: "#FFF",
    width: `calc(1140px + 2 * ${theme.spacing(4)}px)`
  }

});