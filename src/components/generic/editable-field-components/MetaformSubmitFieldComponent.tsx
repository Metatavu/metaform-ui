import { Button, FormControl, InputLabel, OutlinedInput, FormLabel } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";

/**
 * Component props
 */
interface Props {
  field?: MetaformField;
  fieldId?: string;
  onFieldUpdate?: (metaformField: MetaformField) => void;
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
    const {
      field,
      fieldId,
    } = this.props;

    if (!field) {
      return (
        <FormControl>
          <FormLabel htmlFor={ fieldId }>
            { strings.editableFields.default.label }
          </FormLabel>
          <Button
            disabled
            variant="contained"
            color="primary"
          >
            { `"${strings.editableFields.default.submit}"` }
          </Button>
        </FormControl>
      );
    }

    return ( 
      <FormControl>
        <InputLabel htmlFor={ fieldId }>{ strings.editableFields.submitFieldText }</InputLabel>
        <OutlinedInput
          label={ strings.editableFields.submitFieldText }
          id={ fieldId }
          color="secondary"
          value={ field.text }
          disabled={ field.readonly }
          onChange={ this.handleButtonTextChange }
        />
        <Button
          variant="contained"
          color="primary"
        >
          { field.text }
        </Button>  
      </FormControl>
    );
  }

  /**
   * Event handler for submit button value change
   * 
   * @param event new button text value
   */ 
  private handleButtonTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { field, onFieldUpdate } = this.props;

    if (!onFieldUpdate) {
      return;
    }

    const updatedField = {
      ...field 
    } as MetaformField;

    updatedField.text = event.target.value;

    onFieldUpdate(updatedField);
  }

}