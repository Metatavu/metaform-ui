import { createStyles } from "@material-ui/core";

/**
 * Styles for json screen
 */
export default createStyles({

  root: {
    margin: "0",
    maxWidth: "100%",
    padding: "0",
  },
  jsonEditor: {
      marginTop: "1rem",
      height: "100%",
      maxWidth: "100%",
      padding: "5%"
  },
  codeMirror: {
    paddingBottom: "0.5rem",
    "& .CodeMirror": {
      height: "100%"
    }
  },
  toggleReadOnlyButton: {

  },
  sideBar: {
    backgroundColor: "#fff",
  }

});