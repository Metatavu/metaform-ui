import * as React from "react";
import { Link } from "react-router-dom";
import strings from "../../localization/strings";
import { AppBar, Toolbar, Typography, WithStyles, withStyles, Box } from "@material-ui/core";
import styles from "../../styles/admin-layoutv2";
import BasicLayout, { SnackbarMessage } from "./basic-layout";
import { KeycloakInstance } from "keycloak-js";
import { Metaform } from "../../generated/client";
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CodeIcon from '@material-ui/icons/Code';
import { EditorNavigationLinks } from "../../types";
import classNames from "classnames";

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
  activeNavigationLink: EditorNavigationLinks;
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
        <Toolbar/>
        <Box className={ classes.content }>
          { this.props.children }
        </Box>
      </BasicLayout>
    );
  }

  /**
   * Renders navigation bar72
   */
  private renderNavBar = () => {
    return (
      <AppBar style={{ zIndex: 1201 }}>
        <Toolbar>
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
    const { classes, activeNavigationLink } = this.props;

    return (
      <Box
        aria-labelledby={ strings.adminLayoutV2.metaformNavigation }
        className={ classes.navDisplayFlex }
      >
        <Link to="/admin/edit-form/form">
          <Box
            className={ 
              classNames(classes.navBarLink, activeNavigationLink === EditorNavigationLinks.form && classes.activeNavbarLink) 
            }
          >
            <FormatAlignJustifyIcon/>
            <Typography>{ strings.adminLayoutV2.form }</Typography>
          </Box>
        </Link>
        <Link to="/admin/edit-form/preview">
          <Box
            className={
              classNames(classes.navBarLink, activeNavigationLink === EditorNavigationLinks.preview && classes.activeNavbarLink) 
            }
          >
            <VisibilityIcon/>
            <Typography>{ strings.adminLayoutV2.preview }</Typography>
          </Box>
        </Link>
        <Link to="/admin/edit-form/json">
          <Box
            className={
              classNames(classes.navBarLink, activeNavigationLink === EditorNavigationLinks.json && classes.activeNavbarLink) 
            }
          >
            <CodeIcon/>
            <Typography>{ strings.adminLayoutV2.json }</Typography>
          </Box>
        </Link>
      </Box>
    );
  };
}

export default withStyles(styles)(AdminLayoutV2);
