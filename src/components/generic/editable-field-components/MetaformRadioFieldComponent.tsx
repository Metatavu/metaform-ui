import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import React from "react";
import { MetaformField, MetaformFieldOption } from "../../../generated/client";
import strings from "../../../localization/strings";

/**
 * Component props
 */
interface Props {
  field?: MetaformField;
  fieldId?: string;
  fieldLabelId?: string;
  formReadOnly?: boolean;
  onFieldUpdate?: (metaformField: MetaformField) => void;
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
    const { field, fieldId, formReadOnly } = this.props;

    if (!field) {
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">{ strings.editableFields.default.label }</FormLabel>
          <FormControlLabel control={<Radio color="primary" disabled={ formReadOnly }/>} label={ strings.editableFields.default.radio } />
        </FormControl>
      );
    }

    if (!field.name) {
      return null;
    }

    const options = field.options || [];

    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">{ strings.editableFields.radioFieldText }</FormLabel>
        <RadioGroup key={ `${ fieldId }-group-container` }>
          { options.map((option, i) =>  this.renderOption(option)) }
        </RadioGroup>
      </FormControl>
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
      <FormControlLabel 
        className="metaform-radio-field-label"
        key={ `${fieldId}-${option.name}-label` }
        htmlFor={ `${fieldId}-${option.name}` }
        label={ option.text } 
        control={ this.renderOptionValue(option) } 
      />
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
      <Radio
        color="primary"
        key={ `${ fieldId }-${ option.name }-radio` }
        id={ `${ fieldId }-${ option.name }` } 
        aria-labelledby={ fieldLabelId }
        name={ field!.name }
        title={ field!.title }
        required={ field!.required }
        value={ option.name }
      />
    )
  }

}