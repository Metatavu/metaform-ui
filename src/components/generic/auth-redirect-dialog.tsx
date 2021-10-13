import * as React from "react";
import styles from "../../styles/form";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, WithStyles } from "@material-ui/core";
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
    const { onConfirm, classes } = this.props;
    
    return (
      <Dialog
        open={ true }
        BackdropProps={{ style:{ backgroundColor: "#fff", paddingBottom:"100px" }} }
      >
        <DialogTitle disableTypography style={{ fontWeight: 700, paddingBottom: 10 }}>{ strings.authRedirectDialog.title }</DialogTitle>
        <DialogContent>
          <DialogContentText className={ classes.confirmDialogContentText }>
            { strings.authRedirectDialog.contentTextPt1 }
          </DialogContentText>
          <DialogContentText className={ classes.confirmDialogContentText }>
            { strings.authRedirectDialog.contentTextPt2 }
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding:0 }}>
          <Button variant="contained" onClick={ onConfirm } className={ classes.confirmDialogButton } >
            { strings.authRedirectDialog.buttonText }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
