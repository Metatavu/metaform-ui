import { createStyles } from "@material-ui/core";
import theme from "../../theme";

export default createStyles({

  root: {
    width: "100%",
    position: "relative",
  },

  dragHandle: {
    backgroundColor: "transparent",
    borderRadius: "10px 0px 0px 10px",
    transition: "background-color 0.3s ease-in",
    flexDirection: "column",
    position: "absolute",
    left: -48,
    top: 0,
    "&.selected": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${theme.spacing(1.5)}px 0px`,
      height: 92,
      width: 48,
      backgroundColor: theme.palette.primary.main,
      cursor: "grabbing",
      boxShadow: "0px 3px 5px -1px rgba(0, 0, 0, 0.3)"
    }
  }
});