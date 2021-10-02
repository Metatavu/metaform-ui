import { FormControl, FormLabel, InputLabel, TextField, WithStyles, } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";
import styles from "../../../styles/form-edit-screen";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  field?: MetaformField;
  fieldId?: string;
  fieldLabelId?: string;
  formReadOnly?: boolean;
  onFieldUpdate?: (metafromfield: MetaformField) => void;
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
  public render = () => {
    const { 
      classes, 
      field, 
      fieldId, 
      formReadOnly 
    } = this.props;

    if (!field) {
      return (        
        <FormControl>
          <FormLabel>{ strings.editableFields.default.label }</FormLabel>
          <TextField
            type="number"
            variant="standard"
            placeholder={ `"${strings.editableFields.default.number}"` }
            disabled={ formReadOnly }
          />
        </FormControl>
      );
    }

    const inputProps = {
      min: field.min,
      max: field.max,
      step: field.step || 1
    };

    return (
      <>
        <FormControl>
          <InputLabel
            htmlFor={ fieldId }
          >
            { strings.editableFields.numberField }
          </InputLabel>
          <TextField
            variant="standard"
            type="number"
            placeholder={ field.placeholder }
            id={ fieldId }
            name={ field.name }
            title={ field.title }
            required={ field.required }
            disabled={ field.readonly || formReadOnly }
            inputProps={ inputProps }
            className={ classes.numberField }
          />
        </FormControl>
        <FormControl>
          <InputLabel
            htmlFor={ fieldId }
          >
            { strings.editableFields.numberFieldMin }
          </InputLabel>
          <TextField
            variant="standard"
            type="number"
            id={ fieldId }
            value={ field.min?.toString() || "" }
            className={ classes.numberField }
            onChange={ this.handleNumberValueChange }
            name="min"
          />
        </FormControl>
        <FormControl>
          <InputLabel
            htmlFor={ fieldId }
          >
            { strings.editableFields.numberFieldMax }
          </InputLabel>
          <TextField
            variant="standard"
            type="number"
            id={ fieldId }
            value={ field.max?.toString() || "" }
            className={ classes.numberField }
            onChange={ this.handleNumberValueChange }
            name="max"
          />
        </FormControl>
      </>
    );
  }

  /**
   * Event handler for field change
   * 
   * @param event new min number value
  */ 
  private handleNumberValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { field, onFieldUpdate } = this.props;

    if (!onFieldUpdate) {
      return;
    }

    const { value, name } = event.target;

    const updatedField = {
      ...field
    } as MetaformField; 

    switch (name) {
      case "default":
        updatedField._default = value;
        break;
      case "min":
        updatedField.min = parseFloat(value);
        break;
      case "max":
        updatedField.max = parseFloat(value);
        break;
      default:
        break;
    }

    onFieldUpdate(updatedField);
  }
}