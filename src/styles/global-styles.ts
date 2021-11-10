import { createStyles } from "@material-ui/core";

/**
 * Global styles
 */
export default createStyles({

  // TODO Could be used for select component and addable when they are implemented
  textFieldSelectWithBackground: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "30px !important",
      background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255) 100%)",
      "& .MuiSelect-root": {
        backgroundColor: "transparent !important",
      } 
    }
  }

});