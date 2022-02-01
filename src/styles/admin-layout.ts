import { createStyles } from "@material-ui/core";

const drawerWidth = 240;

export default createStyles({

  root: {
    display: "flex",
    height: "100vh"
  },

  drawer: {
    width: drawerWidth
  },

  drawerPaper: {
    width: drawerWidth
  },

  content: {
    flex: 1
  }

});