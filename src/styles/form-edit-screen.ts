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

  formEditor: {
    padding: theme.spacing(10),
  },

  editableForm: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "2rem",
  },

  editableSections: {
    marginBottom: 10,
    borderRadius: 5,
    "& .MuiFormControl-root": {
      width: "100%"
    },
    backgroundColor: "rgba(225,105,40,0.1)"
  },

  editableField: {
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
    width: "100%"
  },

  numberField: {
    width: "30%"
  },

  drawer: {
    height: "100%",
  },

  drawerPaper: {
    height: "100%",
  },

  drawerTabs: {
    width: "100%",
    display: "flex"
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