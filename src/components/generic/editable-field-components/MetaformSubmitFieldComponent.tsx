import { Button, FormControl, InputLabel, OutlinedInput } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  onFieldUpdate: (metaformField: MetaformField) => void;
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
    const { field, onFieldUpdate } = this.props;
    const updatedField = {
      ...field 
    } as MetaformField;

    updatedField.text = event.target.value;

    onFieldUpdate(updatedField);
  }

}