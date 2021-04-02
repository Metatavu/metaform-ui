import * as React from "react";

import { WithStyles, withStyles } from "@material-ui/core";
import styles from "../../styles/admin-layout";
import BasicLayout, { SnackbarMessage } from "./basic-layout";
import { KeycloakInstance } from "keycloak-js";
import { Metaform } from "../../generated/client";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  keycloak: KeycloakInstance;
  metaform?: Metaform;
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
class AdminLayoutV2 extends React.Component<Props, State> {

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
    const { classes, snackbarMessage, error, loading, loadMessage, clearError, clearSnackbar } = this.props;

    return (
      <BasicLayout snackbarMessage={ snackbarMessage } error={ error } loading={ loading } loadMessage={ loadMessage } clearError={ clearError } clearSnackbar={ clearSnackbar }>
        <div className={classes.root}>
          Tähän sitä Jsonia
        </div>
      </BasicLayout>
    );
  }

  /**
   * Renders menu
   */

}

export default withStyles(styles)(AdminLayoutV2);