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
    if (!this.props.field.name) {
      return null;
    }

    return (
      <FormControl variant="outlined" className={ this.props.classes.mainHeader }>
        <InputLabel htmlFor={ this.props.fieldId }>{ strings.editableFields.htmlField }</InputLabel>
        <OutlinedInput
          label={ strings.editableFields.htmlField}
          id={ this.props.fieldId }
          color="secondary"
          value={ this.props.field.html }
          onChange={ this.handleHtmlInputChange }
        />
      </FormControl>
    );
  }

  /**
   * Event handler for html value change
   * 
   * @param event new html value
   * @param index new html value
  */ 
  private handleHtmlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMetaform = this.props.metaform;
    if (newMetaform.sections){
      newMetaform.sections.forEach(section => {
        section.fields?.forEach(field => {
          if( field.type === "html" && field.name === this.props.fieldName){
            field.html = event.target.value;
          }
        })
      });
    }
    this.setState({
      metaform : newMetaform
    })
  }
}