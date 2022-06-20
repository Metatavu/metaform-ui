import { Button, FormControl, WithStyles, withStyles, TextField } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import styles from "../../../styles/generics/editable-field-components/metaform-submit-field-component";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
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
 * Component for Metaform editable submit field
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

    return ( 
      <FormControl>
        <TextField
          variant="outlined"
          label={ field.name }
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

    const updatedField = {
      ...field 
    } as MetaformField;

    updatedField.text = event.target.value;

    onFieldUpdate(updatedField);
  }
}

export default withStyles(styles)(MetaformSubmitFieldComponent);