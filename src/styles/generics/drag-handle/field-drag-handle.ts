import { createStyles } from "@material-ui/core";
import theme from "../../theme";

export default createStyles({

  root: {
    width: "100%"
  },

  dragHandle: {
    height: 0,
    backgroundColor: "transparent",
    borderRadius: "0px 0px 20px 20px",
    transition: "height 0.3s ease-in, background-color 0.3s ease-in",
    "&.selected": {
      marginTop: theme.spacing(1),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `0px ${theme.spacing(2)}px`,
      height: 50,
      backgroundColor: theme.palette.primary.main,
      cursor: "grabbing",
    }
  }
});