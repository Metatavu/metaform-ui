import { FormControl, FormLabel, TextField, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import strings from "../../../localization/strings";
import styles from "../../../styles/generics/editable-field-components/metaform-text-field-component"

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for Metaform text field
 */
export class MetaformTextFieldAddable extends React.Component<Props, State> {

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
  public render = () => (
    <FormControl>
      <FormLabel component="legend">
        { strings.addableComponent.label }
      </FormLabel>
      <TextField
        value=""
        onChange={ this.onChange } 
        variant="standard"
        placeholder={ `"${strings.addableComponent.text}"` }
      />
    </FormControl>
  );

  /**
   * On change event handler
   * 
   * @param event event 
   */
  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }
}

export default withStyles(styles)(MetaformTextFieldAddable);