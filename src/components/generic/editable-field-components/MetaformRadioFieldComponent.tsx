import React from 'react';
import { MetaformField, MetaformFieldOption } from '../../../generated/client';
import { FieldValue } from '../../../types';

/**
 * Component props
 */
interface Props {
  field: MetaformField,
  fieldId: string,
  fieldLabelId: string,
  formReadOnly: boolean,
  value: FieldValue,
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for radio field
 */
export class MetaformRadioFieldComponent extends React.Component<Props, State> {

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

    const options = this.props.field.options || [];
    const value = this.props.value as string;

    return (
      <div>
        {
          options.map((option, i) =>  (
            <div key={ `${this.props.fieldId}-${option.name}-container` }>
              { this.renderOption(option, value) }
            </div>
          ))
        }
      </div>
    );
  }

  /**
   * Renders field option's label
   */
  private renderOption = (option: MetaformFieldOption, value: string) => {
    return (
      <label className="metaform-radio-field-label" key={ `${this.props.fieldId}-${option.name}-label` } htmlFor={ `${this.props.fieldId}-${option.name}` }>
        { this.renderOptionValue(option, value) }
        <span> { option.text } </span>
      </label>
    );
  }

  /**
   * Renders field option's value
   */
  private renderOptionValue = (option: MetaformFieldOption, value: string) => {
    const readOnly = this.props.formReadOnly || this.props.field.readonly;
    const checked: boolean = ((value && value === option.name) || (!value && option.checked)) || false;

    return <input 
      key={ `${this.props.fieldId}-${option.name}-input` }
      type="radio" 
      id={ `${this.props.fieldId}-${option.name}` }  
      aria-labelledby={ this.props.fieldLabelId } 
      name={ this.props.field.name }
      title={ this.props.field.title }
      required={ this.props.field.required }
      readOnly={ this.props.formReadOnly || this.props.field.readonly }
      value={ option.name }
      checked={ checked }
      />
    
  }

}