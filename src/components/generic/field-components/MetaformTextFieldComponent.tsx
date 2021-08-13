import React from 'react';
import { MetaformField } from '../../../generated/client';
import { FieldValue } from '../../../types';

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId?: string;
  fieldLabelId?: string;
  formReadOnly?: boolean;
  value?: FieldValue;
  getFieldValue?: (fieldName: string) => FieldValue;
  onValueChange?: (value: FieldValue) => void;
  onFocus?: () => void;
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform text field
 */
export class MetaformTextFieldComponent extends React.Component<Props, State> {

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
      <input
        type="text"
        placeholder={ this.props.field.placeholder }
        id={ this.props.fieldId }
        aria-labelledby={ this.props.fieldLabelId }
        name={ this.props.field.name } 
        title={ this.props.field.title }
        required={ this.props.field.required }
        readOnly={ this.props.formReadOnly || this.props.field.readonly }
        value={ this.props.value as string || "" }
        onFocus={ this.props.onFocus }
      />
    );
  }

}