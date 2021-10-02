import { FormControl, FormControlLabel, FormLabel, Input, TextField } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";
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

    console.log("text field", field)

    if (!field) {
      return (
        <FormControl>
          <FormLabel component="legend">{ strings.editableFields.default.label }</FormLabel>
          <TextField
            variant="standard"
            placeholder={ `"${strings.editableFields.default.text}"` }
            disabled={ formReadOnly }
          />
        </FormControl>
      );
    }

    //TODO fix the label
    return (
      <FormControl>
        <FormLabel component="legend">{ field.title }</FormLabel>
        <TextField
          variant="standard"
          placeholder={ field.placeholder }
          id={ fieldId }
          aria-labelledby={ fieldLabelId }
          name={ field.name } 
          title={ field.title }
          required={ field.required }
          disabled={ formReadOnly || field.readonly }
          value={ value as string || "" }
          onFocus={ onFocus }
        />    
      </FormControl>
    );
  }
}