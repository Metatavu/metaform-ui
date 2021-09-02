import { Button, FormControl, InputLabel, OutlinedInput } from '@material-ui/core';
import React from 'react';
import { Metaform, MetaformField } from '../../../generated/client';
import strings from '../../../localization/strings';

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  metaform: Metaform;
  onMetaformUpdate: (metaform: Metaform) => void;
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
    const { field, fieldId } = this.props;

    return ( 
      <>
        <FormControl>
          <InputLabel htmlFor={ fieldId }>{ strings.editableFields.submitFieldText }</InputLabel>
          <OutlinedInput
            label={ strings.editableFields.submitFieldText }
            id={ fieldId }
            color="secondary"
            value={ field.text }
            onChange={ this.handleButtonTextChange }
          />
          <Button
            variant="contained"
            color="primary"
          >
            { field.text }
          </Button>  
        </FormControl>
      </>
    );
  }

  /**
   * Event handler for submit button value change
   * 
   * @param event new button text value
  */ 
  private handleButtonTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedMetaform = { ...this.props.metaform };
    if (changedMetaform.sections){
      changedMetaform.sections.forEach(section => {
        section.fields?.forEach(field => {
          if( field.type === "submit"){
            field.text = event.target.value;
          }
        })
      });
    }

    this.props.onMetaformUpdate(changedMetaform);
  }

}