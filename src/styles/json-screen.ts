import { createStyles } from "@material-ui/core";

/**
 * Styles for json screen
 */
export default createStyles({

  root: {
    margin: "20px",
    maxWidth: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "15px",
  },
  jsonEditor: {
      marginTop: "1rem",
      height: "100%",
  },
  codeMirror: {
    paddingBottom: "0.5rem",
    "& .CodeMirror": {
      height: "100%"
    }
  },
  toggleReadOnlyButton: {

  }

});