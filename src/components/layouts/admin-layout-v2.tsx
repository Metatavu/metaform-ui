import * as React from "react";

import { Link } from "react-router-dom";
import strings from "../../localization/strings";

import { AppBar, List, ListItem, ListItemText, Toolbar, Typography, WithStyles, withStyles } from "@material-ui/core";
import styles from "../../styles/admin-layoutv2";
import BasicLayout, { SnackbarMessage } from "./basic-layout";
import { KeycloakInstance } from "keycloak-js";
import { Metaform } from "../../generated/client";
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CodeIcon from '@material-ui/icons/Code';

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
 * Component for admin layout
 */
class AdminLayoutV2 extends React.Component<Props, State> {
  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  /**
   * Renders admin layout
   */
  public render() {
    const {
      classes,
      snackbarMessage,
      error,
      loading,
      loadMessage,
      clearError,
      clearSnackbar,
    } = this.props;

    return (
      <BasicLayout
        snackbarMessage={ snackbarMessage }
        error={ error }
        loading={ loading }
        loadMessage={ loadMessage }
        clearError={ clearError }
        clearSnackbar={ clearSnackbar }
      >
        { this.renderNavBar() }
        <div className={ classes.root }>{ this.props.children }</div>
      </BasicLayout>
    );
  }

  /**
   * Renders navigation bar
   */
  private renderNavBar = () => {
    const { classes } = this.props;

    return (
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          { this.renderLogo() }
          { this.renderNavLinks() }
        </Toolbar>
      </AppBar>
    );
  };

  /**
   * Renders Metaform-logo text
   */
  private renderLogo = () => {
    const { classes } = this.props;

    return (
      <Typography
        variant="h3"
        className={ classes.logoTypography }
        //Placeholder, can be replaced with logo etc.
      >
        <span className={ classes.formLogo }>Meta</span>form
      </Typography>
    );
  };

  /**
   * Renders links for the navigation bara
   */
  private renderNavLinks = () => {
    const { classes } = this.props;

    return (
      <List
        aria-labelledby="Metaform-UI navigation" //localize string
        className={ classes.navDisplayFlex }
      >
        <ListItem
          component={ Link }
          to="/admin/edit-form/form"
          className={ classes.navBarLink }
        >
          <FormatAlignJustifyIcon />
          <ListItemText>{ strings.adminLayoutV2.form }</ListItemText>
        </ListItem>
        <ListItem
          component={ Link }
          to="/admin/edit-form/preview"
          className={ classes.navBarLink }
        >
          <VisibilityIcon />
          <ListItemText>{strings.adminLayoutV2.preview }</ListItemText>
        </ListItem>
        <ListItem
          component={ Link }
          to="/admin/edit-form/json"
          className={ classes.navBarLink }
        >
          <CodeIcon />
          <ListItemText>{ strings.adminLayoutV2.json }</ListItemText>
        </ListItem>
      </List>
    );
  };
}

export default withStyles(styles)(AdminLayoutV2);
