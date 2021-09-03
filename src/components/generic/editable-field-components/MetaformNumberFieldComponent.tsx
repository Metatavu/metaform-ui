import { FormControl, Input, InputLabel, WithStyles, } from "@material-ui/core";
import React from "react";
import { Metaform, MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";
import styles from "../../../styles/form-edit-screen";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  metaform: Metaform;
  onValueUpdate: (key: string, number: number) => void;
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
    const { classes, field, fieldId } = this.props;

    const inputProps = {
      min: field.min,
      max: field.max,
      step: 1
    };

    return (
      <>
        <FormControl>
          <InputLabel
            htmlFor={ fieldId }
          >
            { strings.editableFields.numberField }
          </InputLabel>
          <Input
            type="number"
            placeholder={ field.placeholder }
            id={ fieldId }
            name={ field.name }
            title={ field.title }
            required={ field.required }
            readOnly={ field.readonly }
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
          <Input
            type="number"
            id={ fieldId }
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
          <Input
            type="number"
            id={ fieldId }
            className={ classes.numberField }
            onChange={ this.handleNumberValueChange }
            name="max"
          />
        </FormControl>
      </>
    );
  }

  /**
   * Event handler for minimum number value change
   * 
   * @param event new min number value
  */ 
  private handleNumberValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onValueUpdate } = this.props;
    const { value, name } = event.target;

    if (!name) {
      return;
    }

    onValueUpdate(name, Number(value));
  }
}