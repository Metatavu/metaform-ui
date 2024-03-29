import * as React from "react";
import { Link } from "react-router-dom";
import strings from "../../localization/strings";
import { AppBar, Toolbar, Typography, WithStyles, withStyles, Box, Button, CircularProgress } from "@material-ui/core";
import styles from "../../styles/admin-layoutv2";
import BasicLayout, { SnackbarMessage } from "./basic-layout";
import { KeycloakInstance } from "keycloak-js";
import { Metaform } from "../../generated/client";
import FormatAlignJustifyIcon from "@material-ui/icons/FormatAlignJustify";
import SaveIcon from "@material-ui/icons/Save";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CodeIcon from "@material-ui/icons/Code";
import { EditorNavigationLinks } from "../../types";
import classNames from "classnames";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  keycloak: KeycloakInstance;
  metaform?: Metaform;
  snackbarMessage?: SnackbarMessage;
  error?: string | Error | Response | unknown;
  loading?: boolean;
  loadMessage?: string;
  activeNavigationLink: EditorNavigationLinks;
  clearError?: () => void;
  clearSnackbar?: () => void;
  onMetaformSave?: () => void;
}

/**
 * Interface representing component state
 */
interface State {
  isSavingMetaform: boolean;
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
    this.state = {
      isSavingMetaform: false
    };
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
          { this.renderSaveLoading() }
        </Box>
      </BasicLayout>
    );
  }

  /**
   * Renders navigation bar
   */
  private renderNavBar = () => {
    return (
      <AppBar style={{ zIndex: 1201 }}>
        <Toolbar>
          { this.renderLogo() }
          { this.renderNavLinks() }
          { this.renderSaveButton() }
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
        <Link to="/admin/edit-form/form" className={ classes.link }>
          <Box
            className={ 
              classNames(classes.navBarLink, activeNavigationLink === EditorNavigationLinks.form && classes.activeNavbarLink) 
            }
          >
            <FormatAlignJustifyIcon/>
            <Typography>{ strings.adminLayoutV2.form }</Typography>
          </Box>
        </Link>
        <Link to="/admin/edit-form/preview" className={ classes.link }>
          <Box
            className={
              classNames(classes.navBarLink, activeNavigationLink === EditorNavigationLinks.preview && classes.activeNavbarLink) 
            }
          >
            <VisibilityIcon/>
            <Typography>{ strings.adminLayoutV2.preview }</Typography>
          </Box>
        </Link>
        <Link to="/admin/edit-form/json" className={ classes.link }>
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

  /**
   * Renders save metaform button
   */
  private renderSaveButton = () => {
    const { classes, onMetaformSave } = this.props;
    const { isSavingMetaform } = this.state;

    if (!onMetaformSave) {
      return null;
    }

    return (
      <Box
        className={ classes.saveButtonContainer }
      >
        <Button 
          variant="text"
          disabled={ isSavingMetaform }
          startIcon={ <SaveIcon /> }
          className={ classes.saveButton }
          onClick={ this.onSaveButtonClick }
        >
          { strings.adminLayoutV2.save }
        </Button>
      </Box>
    );
  };

  /**
   * Renders metaform save loading
   */
  private renderSaveLoading = () => {
    const { classes } = this.props;
    const { isSavingMetaform } = this.state;

    if (!isSavingMetaform) {
      return null;
    }

    return (
      <Box
        className={ classes.metaformSaveLoadingContainer }
      >
        <Box className={ classes.metaformLoadingContainer }>
          <CircularProgress size={ 64 }/>
          <Typography className={ classes.savingText }>
            { strings.adminLayoutV2.saving }
          </Typography>
        </Box>
      </Box>
    );
  };

  /**
   * On save button click event handler
   */
  private onSaveButtonClick = async () => {
    const { onMetaformSave } = this.props;

    if (!onMetaformSave) {
      return;
    }

    this.setState({
      isSavingMetaform: true
    });

    await onMetaformSave();

    this.setState({
      isSavingMetaform: false
    });
  };
}

export default withStyles(styles)(AdminLayoutV2);
