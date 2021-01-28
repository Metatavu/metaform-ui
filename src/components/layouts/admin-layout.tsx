import * as React from "react";

import { WithStyles, withStyles, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import styles from "../../styles/admin-layout";
import BasicLayout, { SnackbarMessage } from "./basic-layout";
import Drawer from '@material-ui/core/Drawer';
import MailIcon from '@material-ui/icons/Mail';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TelegramIcon from '@material-ui/icons/Telegram';
import strings from "../../localization/strings";
import { Link } from "react-router-dom";
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
class AdminLayout extends React.Component<Props, State> {

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
          <Drawer className={ classes.drawer } variant="persistent" anchor="left"  open={ true }  classes={{ paper: classes.drawerPaper }}>
            { this.renderMenu() }
          </Drawer>
          <div className={ classes.content }>
            { this.props.children }
          </div>
        </div>
      </BasicLayout>
    );
  }

  /**
   * Renders menu
   */
  private renderMenu = () => {
    return (
      <List>
        { this.renderRepliesMenuItem() }
        { this.renderInviteMenuItem() }
        { this.renderProfileMenuItem() }
        { this.renderLogoutMenuItem() }
      </List>
    );
  }

  /**
   * Renders replies menu item
   */
  private renderRepliesMenuItem = () => {
    return (
      <ListItem button key="replies" component={ Link } to="/admin">
        <ListItemIcon><MailIcon /></ListItemIcon>
        <ListItemText primary={ strings.adminLayout.replies } />
      </ListItem>
    );
  }

  /**
   * Renders invite menu item
   */
  private renderInviteMenuItem = () => {
    const { metaform } = this.props;

    if (!metaform?.allowInvitations) {
      return null;
    }

    return (
      <ListItem button key="invite" component={ Link } to="/admin/invite">
        <ListItemIcon><TelegramIcon /></ListItemIcon>
        <ListItemText primary={ strings.adminLayout.invite } />
      </ListItem>
    );
  }

  /**
   * Renders profile menu item
   */
  private renderProfileMenuItem = () => {
    return (
      <ListItem button key="profile" component="a" href={ this.getProfileLink() }>
        <ListItemIcon><PersonIcon /></ListItemIcon>
        <ListItemText primary={ strings.adminLayout.profile } />
      </ListItem>
    );
  }

  /**
   * Renders logout menu item
   */
  private renderLogoutMenuItem = () => {
    return (
      <ListItem button key="logout" onClick={ this.onLogOutClick }>
        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
        <ListItemText primary={ strings.adminLayout.logout } />
      </ListItem>
    );
  }

  /**
   * Returns link to user profile
   * 
   * @returns link to user profile
   */
  private getProfileLink = (): string => {
    return this.props.keycloak.createAccountUrl();
  }

  /**
   * Event handler for logout button click
   */
  private onLogOutClick = () => {
    const { keycloak } = this.props;
    keycloak.logout();
  }

}

export default withStyles(styles)(AdminLayout);