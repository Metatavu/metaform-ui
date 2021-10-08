import { FormControl, InputLabel, OutlinedInput, WithStyles } from "@material-ui/core";
import React from "react";
import { MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";
import styles from "../../../styles/form-edit-screen";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  fieldName?: string;
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
    const { field, fieldId, classes } = this.props;

    return (
      <FormControl variant="outlined" className={ classes.mainHeader }>
        <InputLabel htmlFor={ fieldId }>{ strings.editableFields.htmlField }</InputLabel>
        <OutlinedInput
          label={ strings.editableFields.htmlField }
          id={ fieldId }
          color="secondary"
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