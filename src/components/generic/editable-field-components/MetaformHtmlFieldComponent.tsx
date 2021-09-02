import { FormControl, InputLabel, OutlinedInput, WithStyles } from '@material-ui/core';
import React from 'react';
import { Metaform, MetaformField } from '../../../generated/client';
import strings from '../../../localization/strings';
import styles from "../../../styles/form-edit-screen";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  metaform: Metaform;
  fieldName?: string;
  onMetaformUpdate: (metaform: Metaform) => void;
}

/**
 * Component state
 */
interface State {
  metaform: Metaform;
}

/**
 * Component for Metaform memo field
 */
export class MetaformHtmlComponent extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      metaform: this.props.metaform
    };
  }

  /**
   * Component render method
   */
  public render() {
    const { field, fieldId, classes } = this.props;

    return (
      <FormControl variant="outlined" className={ classes.mainHeader }>
        <InputLabel htmlFor={ fieldId }>{ strings.editableFields.htmlField }</InputLabel>
        <OutlinedInput
          label={ strings.editableFields.htmlField }
          id={ fieldId }
          color="secondary"
          value={ field.html }
          onChange={ this.handleHtmlInputChange }
        />
      </FormControl>
    );
  }

  /**
   * Event handler for html value change
   * 
   * @param event new html value
  */ 
  private handleHtmlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedMetaform = { ...this.props.metaform };

    if (changedMetaform.sections) {
      changedMetaform.sections.forEach(section => {
        section.fields?.forEach(field => {
          if (field.type === "html" && field.name === this.props.fieldName) {
            field.html = event.target.value;
          }
        })
      });
    }

    this.props.onMetaformUpdate(changedMetaform);
  }
}