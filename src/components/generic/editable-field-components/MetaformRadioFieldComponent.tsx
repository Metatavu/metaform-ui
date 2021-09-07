import React from "react";
import { MetaformField, MetaformFieldOption } from "../../../generated/client";

/**
 * Component props
 */
interface Props {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
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
    const { field, fieldId } = this.props;

    if (!field.name) {
      return null;
    }

    const options = field.options || [];

    return (
      <div>
        {
          options.map((option, i) =>  (
            <div key={ `${ fieldId }-${ option.name }-container` }>
              { this.renderOption(option) }
            </div>
          ))
        }
      </div>
    );
  }

  /**
   * Renders field option"s label
   * 
   * @param option metaform field option
   * @param value value
   */
  private renderOption = (option: MetaformFieldOption) => {
    const { fieldId } = this.props;
    return (
      <label className="metaform-radio-field-label" key={ `${fieldId}-${option.name}-label` } htmlFor={ `${fieldId}-${option.name}` }>
        { this.renderOptionValue(option) }
        <span> { option.text } </span>
      </label>
    );
  }

  /**
   * Renders field option"s value
   * 
   * @param option metaform field option
   * @param value value
   */
  private renderOptionValue = (option: MetaformFieldOption) => {
    const { field, fieldId, fieldLabelId } = this.props;

    return (
      <input 
        key={ `${ fieldId }-${ option.name }-input` }
        type="radio" 
        id={ `${ fieldId }-${ option.name }` }  
        aria-labelledby={ fieldLabelId } 
        name={ field.name }
        title={ field.title }
        required={ field.required }
        value={ option.name }
      />
    )
  }

}