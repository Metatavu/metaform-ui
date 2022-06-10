import { FormControl, TextareaAutosize, Typography, withStyles } from '@material-ui/core';
import { MetaformField } from 'metaform-react/dist/generated/client/models/MetaformField';
import React from 'react';
import styles from "../../../styles/generics/editable-field-components/metaform-memo-field-component";

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  onFieldUpdate: (metaformField: MetaformField) => void;
}

/**
 * Component state
 */
interface State {

}

/**
 * Component for Metaform editable memo field
 */
export class MetaformMemoFieldComponent extends React.Component<Props, State> {

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
    const { field, fieldId, fieldLabelId } = this.props;

    if (!field.name) {
      return null;
    }

    return (
      <FormControl>
        <Typography variant="body1">
          { field.title }
        </Typography>
        <TextareaAutosize
          placeholder={ field.placeholder }
          id={ fieldId }
          aria-labelledby={ fieldLabelId }
          name={ field.name }
          title={ field.title }
          required={ field.required }
          onChange={ this.handleMemoInputChange }
          style={{ width: 300, height: 50 }}
        />
      </FormControl>
    );
  }

  /**
   * Event handler for memo value change
   * 
   * @param event new memo value
  */ 
  private handleMemoInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { field, onFieldUpdate } = this.props;

    const updatedField = { 
      ...field 
    } as MetaformField;

    updatedField.html = event.target.value;

    onFieldUpdate(updatedField);
  }

}

export default withStyles(styles)(MetaformMemoFieldComponent);