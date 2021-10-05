import { createStyles } from "@material-ui/core";
import theme from "./theme";

/**
 * Styles for form-edit screen
 */
export default createStyles({

  root: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },

  componentContainer: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4)
  },

  addNewSectionButton: {
    alignSelf: "flex-end"
  },

  formEditor: {
    padding: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  formEditorSection: {
    width: 880,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    padding: `${theme.spacing(3)}px ${theme.spacing(5)}px`,
    boxShadow: "none",
    margin: `${theme.spacing(2)}px 0px`,
    "& .MuiFormControl-root": {
      width: "100%"
    }
  },

  formEditorField: {
    width: "100%",
    padding: `${theme.spacing(1)}px 0px`,
  },


  singleDraggableComponent: {
    marginBottom: theme.spacing(2),
    "&.clone": {
      "&+ div": {
        display: "none !important",
      }
    }
  },

  numberField: {
    width: "30%"
  },

  drawer: {
    height: "100%"
  },

  drawerPaper: {
    height: "100%",
    boxShadow: "0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12)"
  },

  drawerTabs: {
    width: "100%",
    display: "flex"
  },

  drawerContent: {
    flex: 1,
    overflow: "auto",
    overflowX: "hidden"
  },

  drawerTab: {
    width: "50%",
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center"
  },

  mainHeader: {
    marginBottom: 20,
    width: "100%",
    textAlign: "center",
  },

  fields: {
    borderRadius: "5px",
    boxShadow: "2px 2px #ccc",
    marginBottom: "0.5rem",
    marginLeft: "10%",
    maxWidth: "80%",
    textAlign: "center",
  },

  components: {
    boxShadow: "2px 2px #ccc",
    borderRadius: "5px",
    marginBottom: "0.5rem",
    marginLeft: "10%",
    maxWidth: "80%",
    textAlign: "center",
  },

  fieldHeader: {
    backgroundColor: "#60605f",
    borderRadius: "5px",
    color: "#fff",
    maxWidth: "80%",
    marginBottom: "0.5rem",
    marginLeft: "10%",
    textAlign: "center",
    "& .MuiTypography-root": {
      fontWeight: "bold",
      textTransform: "uppercase",
    }
  },

  componentHeader: {
    backgroundColor: "#60605f",
    borderRadius: "5px",
    color: "#fff",
    maxWidth: "80%",
    marginBottom: "0.5rem",
    marginTop: "1rem",
    marginLeft: "10%",
    textAlign: "center",
    "& .MuiTypography-root": {
      fontWeight: "bold",
      textTransform: "uppercase",
    }
  }

});