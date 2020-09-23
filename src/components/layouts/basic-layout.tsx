import * as React from "react";

import { WithStyles, withStyles, Snackbar, CircularProgress, Typography } from "@material-ui/core";
import styles from "../../styles/basic-layout";
import ErrorDialog from "../generic/error-dialog";
import MuiAlert from '@material-ui/lab/Alert';
import strings from "../../localization/strings";

export interface SnackbarMessage { 
  message: string; 
  severity: "success" | "info" | "warning" | "error";
}

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  snackbarMessage?: SnackbarMessage;
  error?: string | Error | Response;
  loading?: boolean;
  loadMessage?: string;
  clearError?: () => void;
  clearSnackbar?: () => void;
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Component for basic application layout
 */
class BasicLayout extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  /**
   * Render basic layout
   */
  public render() {
    const { classes } = this.props;

    if (!this.props.error && this.props.loading) {
      return this.renderLoader();
    }

    return (
      <div className={ classes.root }>        
        { this.renderContents() }
      </div>
    );
  }

  /**
   * Renders loader
   */
  private renderLoader = () => {
    const { classes } = this.props;
    const text = this.props.loadMessage || strings.generic.loading;

    return (
      <div className={ classes.root }>        
        <div className={ classes.loaderContainer }>
          <CircularProgress size={ 50 } className={ classes.loader }></CircularProgress>
          <Typography  className={ classes.loaderText }>{ text }</Typography>
        </div>
      </div>
    );
  }

  /**
   * Renders contents
   */
  private renderContents = () => {
    const { classes } = this.props;

    return (
      <>
        <div className={ classes.content }>
          { this.props.children }
        </div>
        { this.renderErrorDialog() }
        { this.renderSnackbar() }
      </>
    );
  }

  /**
   * Renders snackbar
   */
  private renderSnackbar = () => {
    return (
      <Snackbar open={ !!this.props.snackbarMessage } autoHideDuration={ 6000 } onClose={ this.props.clearSnackbar } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <MuiAlert elevation={ 6 } variant="filled" onClose={ this.props.clearSnackbar } severity={ this.props.snackbarMessage?.severity }>
          { this.props.snackbarMessage?.message || "" }
        </MuiAlert>
      </Snackbar>
    );
  }

  /**
   * Renders error dialog
   */
  private renderErrorDialog = () => {
    if (this.props.error && this.props.clearError) {
      return <ErrorDialog error={ this.props.error } onClose={ this.props.clearError } />;
    }

    return null;
  }

}

export default withStyles(styles)(BasicLayout);