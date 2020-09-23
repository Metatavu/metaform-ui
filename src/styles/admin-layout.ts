import { createStyles } from "@material-ui/core";

const drawerWidth = 240;

export default createStyles({

  root: {
    display: "flex"
  },
  
  drawer: {
    width: drawerWidth,
    flex: 0
  },

  drawerPaper: {
    width: drawerWidth,
  },
  
  content: {
    marginLeft: drawerWidth,
    flex: 1
  }

});