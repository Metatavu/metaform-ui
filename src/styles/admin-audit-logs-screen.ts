import { createStyles } from "@material-ui/core";
import theme from "./theme";

export default createStyles({

  contentWrapper: {
    padding: 48,
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },

  header: {
    display: "flex"
  },

  filterWrapper: {
    display: "flex",
    marginLeft: "auto",
    "& :not(:last-child)": {
      marginRight: theme.spacing(2)
    }
  },

  centerContent: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center"
  },

  tableWrapper: {
    marginTop: 32,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #ddd",
    height: "100%",
    "& .ReactVirtualized__Table__headerRow": {
      backgroundColor: "#E0E0E0",
      color: theme.palette.grey[800],
      textTransform: "initial"
    }
  },

  createdAtHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  sortButton: {
    padding: 8
  },

  replyLink: {
    color: theme.palette.grey[800]
  }

});