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

  addNewSectionButton: {
    alignSelf: "flex-end"
  },

  formEditor: {
    margin: theme.spacing(8),
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
    overflow: "hidden",
    "& .MuiFormControl-root": {
      width: "100%"
    },
    "&.selected": {
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: "0px 3px 10px -1px rgb(0 0 0 / 40%)"
    },
    "&.draggingOver": {
      backgroundColor: "#fff",
      animationName: "$border-dance",
      animationDuration: "3s",
      animationIterationCount: "infinite",
      animationTimingFunction: "linear",
      background: `linear-gradient(90deg, ${theme.palette.primary.main} 50%, #FFF 50%), linear-gradient(90deg, ${theme.palette.primary.main} 50%, #FFF 50%), linear-gradient(0deg, ${theme.palette.primary.main} 50%, #FFF 50%), linear-gradient(0deg, ${theme.palette.primary.main} 50%, #FFF 50%)`,
      backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
      backgroundSize: "15px 3px, 15px 3px, 3px 15px, 3px 15px",
      backgroundPosition: "0px 0px, 100% 100%, 0px 100%, 100% 0px",
      boxShadow: "0px 3px 10px -1px rgb(0 0 0 / 40%)"
    }
  },

  "@keyframes border-dance": {
    "0%": {
      backgroundPosition: "0px 0px, 200px 100%, 0px 200px, 100% 0px",
    },
    "100%": {
      backgroundPosition: "200px 0px, 0px 100%, 0px 0px, 100% 200px"
    }
  },

  formEditorField: {
    width: "100%",
    padding: `${theme.spacing(1)}px 0px`,
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

  sectionHeader: {
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