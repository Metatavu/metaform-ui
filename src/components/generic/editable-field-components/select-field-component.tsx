import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { MetaformField } from "../../../generated/client";
import styles from "../../../styles/generics/editable-field-components/metaform-select-field-component";

/**
 * Component props
 */
interface Props {
  field: MetaformField
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for Metaform editable select field
 */
export class MetaformSelectFieldComponent extends React.Component<Props, State> {

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
    const { field } = this.props;

    if (!field.name) {
      return null;
    }

    const options = field.options || [];

    return (
      <FormControl>
        <InputLabel>{ field.title }</InputLabel>
        <Select autoFocus={ false } disabled={ true }>
          { options.map((option) => <MenuItem key={ option.name } value={ option.name }>{ option.text }</MenuItem>) }
        </Select>
      </FormControl>
    );
  }

}

export default withStyles(styles)(MetaformSelectFieldComponent)