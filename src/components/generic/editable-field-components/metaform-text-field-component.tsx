import { FormControl, FormLabel, TextField, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";
import { FieldValue } from "../../../types";
import styles from "../../../styles/generics/editable-field-components/metaform-text-field-component"

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  field?: MetaformField;
  fieldId?: string;
  fieldLabelId?: string;
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
    const { 
      field, 
      fieldId, 
      fieldLabelId, 
      value, 
      onFocus 
    } = this.props;

    if (!field) {
      return (
        <FormControl>
          <FormLabel component="legend">{ strings.editableFields.default.label }</FormLabel>
          <TextField
            disabled
            variant="standard"
            placeholder={ `"${strings.editableFields.default.text}"` }
          />
        </FormControl>
      );
    }

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
          disabled={ field.readonly }
          value={ value as string || "" }
          onFocus={ onFocus }
        />
      </FormControl>
    );
  }
}

export default withStyles(styles)(MetaformTextFieldComponent);