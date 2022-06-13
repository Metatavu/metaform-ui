import React from "react";
import { MetaformField } from "../../../generated/client";
import { withStyles } from "@material-ui/styles";
import styles from "../../../styles/generics/editable-field-components/metaform-autocomplete-field-component";
import { FormControl, FormLabel, TextField } from "@material-ui/core";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for Metaform editable autocomplete field
 */
export class MetaformAutocompleteFieldComponent extends React.Component<Props, State> {

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
    } = this.props;

    return (
      <FormControl>
        <FormLabel component="legend">{ field.title } ({ field.type })</FormLabel>
        <TextField label={ field.name }/>
      </FormControl>
    )
  }
}

export default withStyles(styles)(MetaformAutocompleteFieldComponent)
