import { createStyles } from "@material-ui/core";
import theme from "./theme";

/**
 * Styles for json screen
 */
export default createStyles({

  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center"
  },

  jsonEditor: {
    marginTop: theme.spacing(2),
    height: "100%",
    padding: theme.spacing(12)
  },

  codeMirror: {
    paddingBottom: "0.5rem",
    "& .CodeMirror": {
      height: "100%"
    }
  },

  toggleReadOnlyButton: {

  },

});