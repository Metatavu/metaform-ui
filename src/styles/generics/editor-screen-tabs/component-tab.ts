import { createStyles } from "@material-ui/core";
import theme from "../../theme";

export default createStyles({

  singleDraggableComponent: {
    marginBottom: theme.spacing(2),
    "&.clone": {
      "&+ div": {
        display: "none !important",
      }
    }
  },


  componentContainer: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4)
  },

});