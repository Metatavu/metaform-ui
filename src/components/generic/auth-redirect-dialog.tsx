import * as React from "react";
import styles from "../../styles/form";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, WithStyles } from "@material-ui/core";
import strings from "../../localization/strings";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  onConfirm: () => void;
  dialogOpen: boolean;
}

/**
 * Interface representing component state
 */
interface State {

}

/**
 * React component displaying confirm dialogs
 */
export default class ConfirmAuthRedirectDialog extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = { };
  }

  /** 
   * Component render method
   */
  public render() {
    const { dialogOpen, onConfirm, classes } = this.props;
    return (
      <Dialog
        open={ dialogOpen }
        BackdropProps={{ style:{ backgroundColor: "#fff", paddingBottom:"100px" }} }
      >
        <DialogTitle disableTypography style={{ fontWeight: 700, paddingBottom: 0 }} id="alert-dialog-title">{ strings.authRedirectDialog.title }</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography style={{ fontSize:14, lineHeight:1.5 }}>
              { strings.authRedirectDialog.contentTextPt1 }
            </Typography>
            <Typography style={{ fontSize:14, lineHeight:1 }}>
              { strings.authRedirectDialog.contentTextPt2 }
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding:0 }}>
          <Button variant="contained" onClick={ onConfirm } style={{ background: "#2f80ed", color:"#fff", borderRadius:"30px", width:"120px", margin:"0px 20px 20px 0px" }} >
            { strings.authRedirectDialog.buttonText }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
