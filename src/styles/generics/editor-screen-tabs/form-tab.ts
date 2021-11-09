import { createStyles } from "@material-ui/core";
import theme from "../../theme";

export default createStyles({

  formEditingContainer: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4)
  },

  switchGroupContainer: {
    display: "flex",
    flexDirection: "column",
    padding: `${theme.spacing(2)}px 0px`
  },

  switchContainer: {
    display: "flex",
    alignItems: "center"
  }

});