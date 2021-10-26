import { FormControl, TextField, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import styles from "../../../styles/generics/editable-field-components/metaform-html-field-component";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  onFieldUpdate: (metaformField: MetaformField) => void;
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for Metaform memo field
 */
export class MetaformHtmlComponent extends React.Component<Props, State> {

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
          disabled={ field.readonly }
          label={ field.name }
          id={ fieldId }
          color="primary"
          value={ field.html }
          onChange={ this.handleHtmlInputChange }
        />
      </FormControl>
    );
  }

  /**
   * Event handler for html value change
   * 
   * @param event new html value
  */ 
  private handleHtmlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { field, onFieldUpdate } = this.props;

    const updatedField = { 
      ...field 
    } as MetaformField;

    updatedField.html = event.target.value;

    onFieldUpdate(updatedField);
  }
}

export default withStyles(styles)(MetaformHtmlComponent)