import { createStyles } from "@material-ui/core";
import theme from "../../theme";

export default createStyles({

  root: {
    width: "100%"
  },

  dragHandle: {
    display: "none",
    height: 0,
    "&.selected": {
      marginTop: theme.spacing(1),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `0px ${theme.spacing(2)}px`,
      height: 50,
      backgroundColor: theme.palette.primary.main,
      transition: "height 0.5s ease-in-out",
      borderRadius: "0px 0px 20px 20px",
      cursor: "grabbing",
    }
  }
});