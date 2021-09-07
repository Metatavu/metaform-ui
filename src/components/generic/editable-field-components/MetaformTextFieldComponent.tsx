import React from "react";
import { MetaformField } from "../../../generated/client";
import { FieldValue } from "../../../types";

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
    const { field, fieldId, fieldLabelId, formReadOnly, value, onFocus } = this.props;

    return (
      <input
        type="text"
        placeholder={ field.placeholder }
        id={ fieldId }
        aria-labelledby={ fieldLabelId }
        name={ field.name } 
        title={ field.title }
        required={ field.required }
        readOnly={ formReadOnly || field.readonly }
        value={ value as string || "" }
        onFocus={ onFocus }
      />
    );
  }

}