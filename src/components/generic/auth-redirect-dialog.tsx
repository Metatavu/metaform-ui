import * as React from "react";

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import strings from "../../localization/strings";

/**
 * Interface representing component properties
 */
interface Props {
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
    const { dialogOpen, onConfirm } = this.props;
    return (
      <Dialog
        open={ dialogOpen }
        maxWidth="xl"
        BackdropProps={{ style: { backgroundColor: "#fff", paddingBottom:"100px" } }}
      >
        <DialogTitle disableTypography id="alert-dialog-title">{ strings.authRedirectDialog.title }</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { strings.authRedirectDialog.contentText }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={ onConfirm } color="primary">
            { strings.authRedirectDialog.buttonText }
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
