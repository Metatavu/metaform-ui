import { FormControl, Input, } from '@material-ui/core';
import React from 'react';
import { MetaformField } from '../../../generated/client';
import { FieldValue } from '../../../types';

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  //value: FieldValue,
  //onValueChange: (value: FieldValue) => void,
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform number field
 */
export class MetaformNumberFieldComponent extends React.Component<Props, State> {

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
    if (!this.props.field.name) {
      return null;
    }

    return (
      <FormControl>
        <Input
          type="number"
          placeholder={ this.props.field.placeholder }
          id={ this.props.fieldId }
          aria-labelledby={ this.props.fieldLabelId }
          name={ this.props.field.name }
          title={ this.props.field.title }
          required={ this.props.field.required }
          readOnly={ this.props.field.readonly }
          //value={ this.props.value as number || "" }
        />
      </FormControl>
    );
  }

}