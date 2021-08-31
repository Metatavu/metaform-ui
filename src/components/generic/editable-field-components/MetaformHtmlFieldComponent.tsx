import { FormControl, InputLabel, OutlinedInput } from '@material-ui/core';
import React from 'react';
import { MetaformField } from '../../../generated/client';
import strings from '../../../localization/strings';
import { FieldValue } from '../../../types';

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  getFieldValue?: (field: MetaformField) => FieldValue;
  index : number;
  htmlChange?: (index: number, value: React.ChangeEvent<HTMLInputElement>) => React.ChangeEvent<HTMLInputElement>;
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
    if (!this.props.field.name) {
      return null;
    }

    const dangerousInnerHTML = this.props.field.html || "";

    return (
      <>
      <div
        id={ this.props.fieldId }
        aria-labelledby={ this.props.fieldLabelId }
        dangerouslySetInnerHTML={{ __html: dangerousInnerHTML }}>
      </div>
      <FormControl variant="outlined">
      <InputLabel htmlFor="htmlField">{ strings.editableComponents.htmlComponent }</InputLabel>
      <OutlinedInput
        label={ strings.editableComponents.htmlComponent }
        id="htmlField"
        color="secondary"
        value={ this.props.field.html }
        //onChange={ this.props.htmlChange(this.props.index, event?.target.value) }
      />
    </FormControl>
      </>
    );
  }
}