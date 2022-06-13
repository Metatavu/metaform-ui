import React from "react";
import { MetaformField } from "../../../generated/client";
import { withStyles } from "@material-ui/styles";
import styles from "../../../styles/generics/editable-field-components/metaform-boolean-field-component";
import { FormControl, FormLabel, TextField } from "@material-ui/core";
import strings from "../../../localization/strings";

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
 * Component for Metaform editable boolean field
 */
export class MetaformBooleanFieldComponent extends React.Component<Props, State> {

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
        <FormLabel component="legend">{ field.title }</FormLabel>
        <TextField
          variant="standard"
          name={ field.name }
          value={ field.type + " " + strings.formEditScreen.notYetSupported }
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(MetaformBooleanFieldComponent);
