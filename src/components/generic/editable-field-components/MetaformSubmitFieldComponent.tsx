import { Button, FormControl, Input, InputLabel, OutlinedInput } from '@material-ui/core';
import React from 'react';
import { Metaform, MetaformField } from '../../../generated/client';
import strings from '../../../localization/strings';
import { FieldValue } from '../../../types';

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  value: FieldValue;
  metaform: Metaform;
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform submit field
 */
export class MetaformSubmitFieldComponent extends React.Component<Props, State> {

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
    const { field } = this.props;

    if (!field.name) {
      return null;
    }

    return ( 
      <>
        <FormControl>
          <InputLabel htmlFor={ this.props.fieldId }>{ strings.editableFields.submitFieldText }</InputLabel>
          <OutlinedInput
            label={ strings.editableFields.submitFieldText }
            id={ this.props.fieldId }
            color="secondary"
            value={ this.props.field.text }
            onChange={ this.handleButtonTextChange }
          />
          <Button
            variant="contained"
            color="primary"
          >
            { this.props.field.text }
          </Button>  
        </FormControl>
      </>
    );
  }

  /**
   * Event handler for submit button value change
   * 
   * @param event new button text value
   * @param index new button text value
  */ 
  private handleButtonTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMetaform = this.props.metaform;
    if (newMetaform.sections){
      newMetaform.sections.forEach(section => {
        section.fields?.forEach(field => {
          if( field.type === "submit"){
            field.text = event.target.value;
          }
        })
      });
    }
    this.setState({
      metaform : newMetaform
    })
  }

}