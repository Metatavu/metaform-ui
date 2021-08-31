import React, { CSSProperties } from 'react';
import { MetaformField } from '../../../generated/client';
import { FieldValue } from '../../../types';

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  value: FieldValue;
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
    const { field } = this.props;

    if (!field.name) {
      return null;
    }

    return (
      <input
        type="submit"
        value={ this.props.field.text }
      />
    );
  }

}