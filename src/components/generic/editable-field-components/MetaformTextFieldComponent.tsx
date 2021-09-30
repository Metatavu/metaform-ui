import { Input } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import { FieldValue } from "../../../types";

/**
 * Component props
 */
interface Props {
  field?: MetaformField;
  fieldId?: string;
  fieldLabelId?: string;
  formReadOnly?: boolean;
  value?: FieldValue;
  getFieldValue?: (fieldName: string) => FieldValue;
  onFieldUpdate?: (metaformField: MetaformField) => void;
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

    if (!field) {
      return (
        <Input
          type="text"
          readOnly={ formReadOnly }
          value={ value as string || "" }
          onFocus={ onFocus }
        />
      );
    }

    return (
      <Input
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