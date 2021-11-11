import { Box, TextField, Checkbox, FormControlLabel } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "../../../styles/generics/editor-screen-tabs/form-tab";
import { MetaformSection, MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  selectedSection?: MetaformSection;
  selectedField?: MetaformField;
  onSetMetaformSectionUpdate?: (metaformSection: MetaformSection) => void;
  onSetMetaformFieldUpdate?: (metaformField: MetaformField) => void;
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Form tab 
 */
class SelectionTab extends React.Component<Props, State> {

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
    const { selectedSection, selectedField } = this.props;

    if (!selectedSection) {
      return null;
    }

    return (
      <>
        { selectedField ? this.renderSelectedField() : this.renderSelectedSection() }
      </>
    );
  }

  /**
   * Renders metaform selected field
   */
  private renderSelectedField = () => {
    const { selectedField, onSetMetaformFieldUpdate } = this.props;

    if (!selectedField || !onSetMetaformFieldUpdate) {
      return null;
    }


    return (
      <>
        { this.renderFieldGenerals() }
        {/* { renderFieldContext() }
        { renderVisibleIf() } */}
      </>
    );
  }

  /**
   * Renders metaform selected section
   */
  private renderSelectedSection = () => {
    const { selectedSection, onSetMetaformSectionUpdate } = this.props;

    if (!selectedSection || !onSetMetaformSectionUpdate) {
      return null;
    }


    return (
      <>
        { this.renderSectionGenerals() }
        {/* { renderVisibleIf() } */}
      </>
    );
  }

  /**
   * Renders metaform selected field generals
   */
  private renderFieldGenerals = () => {
    const { selectedField } = this.props;

    if (!selectedField) {
      return null;
    }

    return (
      <Box>
        <TextField
          value={ selectedField.title }
          label={ "Title" }
          onChange={ this.onFieldTitleChange }
        />
        <TextField
          value={ selectedField.name }
          label={ "Name" }
          onChange={ this.onFieldNameChange }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={ selectedField.required }
              onChange={ this.onFieldRequiredChange }
            />
          }
          label="Required"
        />
      </Box>
    );
  }

  /**
   * Renders metaform selected field generals
   */
  private renderSectionGenerals = () => {
    const { selectedSection } = this.props;

    if (!selectedSection) {
      return null;
    }

    return (
      <Box>
        <TextField
          value={ selectedSection.title }
          label={ "Title" }
          onChange={ this.onSectionTitleChange }
        />
      </Box>
    );
  }

  /**
   * Updates selected field title
   * 
   * @param event event
   */
  private onFieldTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { selectedField, onSetMetaformFieldUpdate } = this.props;

    if (!selectedField || !onSetMetaformFieldUpdate) {
      return;
    }
    
    const updatedMetaformField: MetaformField = {
      ...selectedField,
      title: event.target.value
    };

    onSetMetaformFieldUpdate(updatedMetaformField);
  }

  /**
   * Updates selected field title
   * 
   * @param event event
   */
  private onSectionTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { selectedSection, onSetMetaformSectionUpdate } = this.props;

    if (!selectedSection || !onSetMetaformSectionUpdate) {
      return;
    }
    
    const updatedMetaformSection: MetaformSection = {
      ...selectedSection,
      title: event.target.value
    };

    onSetMetaformSectionUpdate(updatedMetaformSection);
  }

  /**
   * Updates selected field name
   * 
   * @param event event
   */
  private onFieldNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { selectedField, onSetMetaformFieldUpdate } = this.props;

    if (!selectedField || !onSetMetaformFieldUpdate) {
      return;
    }
    
    const updatedMetaformField: MetaformField = {
      ...selectedField,
      name: event.target.value
    };

    onSetMetaformFieldUpdate(updatedMetaformField);
  }

  /**
   * Updates selected field name
   * 
   * @param event event
   */
  private onFieldRequiredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { selectedField, onSetMetaformFieldUpdate } = this.props;

    if (!selectedField || !onSetMetaformFieldUpdate) {
      return;
    }
    
    const updatedMetaformField: MetaformField = {
      ...selectedField,
      required: event.target.checked
    };

    onSetMetaformFieldUpdate(updatedMetaformField);
  }
}

export default withStyles(styles)(SelectionTab);