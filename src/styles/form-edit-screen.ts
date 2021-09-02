import { createStyles } from "@material-ui/core";

/**
 * Styles for form-edit screen
 */
export default createStyles({

  root: {
    margin: "0",
    maxWidth: "100%",
    padding: "0",
  },

  formEditor: {
    height: "100%",
    padding: "5rem",
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

  sideBar: {
    backgroundColor: "#fff",
    minHeight: "100vw"
  },

  sideBarTabs: {
    float: "left",
    borderBottom: "5px black",
    minWidth: "50%",
    textAlign: "center",
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