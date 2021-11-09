import { Box, TextField, Switch, Typography } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "../../../styles/generics/editor-screen-tabs/form-tab";
import { Metaform } from "../../../generated/client";
import strings from "../../../localization/strings";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  onSetMetaform: (metaform?: Metaform) => void;
  metaform?: Metaform;
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Form tab
 */
class FormTab extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }

  /**
   * Component render method
   */
  public render() {
    const { classes, metaform } = this.props;

    if (!metaform) {
      return null;
    }

    return (
      <Box className={ classes.formEditingContainer }>
        { this.renderTitleInput() }
        { this.renderSwitchGroup() }
      </Box>
    );
  }

  /**
   * Renders title input
   */
  private renderTitleInput = () => {
    const { metaform } = this.props;

    if (!metaform) {
      return null;
    }

    return (
      <TextField
        variant="outlined"
        value={ metaform.title }
        onChange={ this.onFormTitleChange }
        label={strings.formTab.title  }
      />
    );
  }

  /**
   * Renders title input
   */
  private renderSwitchGroup = () => {
    const { metaform, classes } = this.props;

    if (!metaform) {
      return null;
    }

    return (
      <Box className={ classes.switchGroupContainer }>
        { this.renderSwitch(!!metaform.allowAnonymous, strings.formTab.allowAnonymous, this.onAllowAnonToggle) }
        { this.renderSwitch(!!metaform.allowDrafts, strings.formTab.allowDraft, this.onAllowDraftToggle) }
        { this.renderSwitch(!!metaform.allowReplyOwnerKeys, strings.formTab.allowReplyOwnerKey, this.onAllowOwnerKeyToggle) }
        { this.renderSwitch(!!metaform.allowInvitations, strings.formTab.allowInvitation, this.onAllowInvitationToggle) }
      </Box>
    );
  }

  /**
   * Renders title input
   */
  private renderSwitch = (value: boolean, label: string, onChange: (event: React.ChangeEvent<HTMLInputElement>) => void) => {
    const { classes } = this.props;

    // TODO value fix
    // TODO icon button drag handle

    return (
      <Box className={ classes.switchContainer }>
        <Switch
          color="primary"
          value={ value }
          onChange={ onChange }
        />
        <Typography>
          { label }  
        </Typography>
      </Box>
    );
  }

  /**
   * Form title change handler
   * 
   * @param event react input change event
   */
  private onFormTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { metaform, onSetMetaform } = this.props;

    const updatedMetaform: Metaform = {
      ...metaform,
      title: event.target.value as string,
    }

    onSetMetaform(updatedMetaform);
  }

  /**
   * Form allow anonymous toggle handler
   * 
   * @param event react input change event
   */
  private onAllowAnonToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { metaform, onSetMetaform } = this.props;

    const updatedMetaform: Metaform = {
      ...metaform,
      allowAnonymous: event.target.checked
    }

    onSetMetaform(updatedMetaform);
  }

  /**
   * Form allow draft toggle handler
   * 
   * @param event react input change event
   */
  private onAllowDraftToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { metaform, onSetMetaform } = this.props;

    const updatedMetaform: Metaform = {
      ...metaform,
      allowDrafts: event.target.checked
    }

    onSetMetaform(updatedMetaform);
  }

  /**
   * Form allow owner key toggle handler
   * 
   * @param event react input change event
   */
  private onAllowOwnerKeyToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { metaform, onSetMetaform } = this.props;

    const updatedMetaform: Metaform = {
      ...metaform,
      allowReplyOwnerKeys: event.target.checked
    }

    onSetMetaform(updatedMetaform);
  }

    /**
   * Form allow owner key toggle handler
   * 
   * @param event react input change event
   */
  private onAllowInvitationToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { metaform, onSetMetaform } = this.props;

    const updatedMetaform: Metaform = {
      ...metaform,
      allowInvitations: event.target.checked
    }

    onSetMetaform(updatedMetaform);
  }
}

export default withStyles(styles)(FormTab);