import { createStyles } from "@material-ui/core";
import theme from "../../theme";
import globalStyles from "../../global-styles";

export default createStyles({

  formEditingContainer: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4)
  },

  switchGroupContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2)
  },

  switchContainer: {
    display: "flex",
    alignItems: "center"
  },

  replyStrategySelect: {
    marginTop: theme.spacing(2),
    ...globalStyles.textFieldSelectWithBackground
  }

});