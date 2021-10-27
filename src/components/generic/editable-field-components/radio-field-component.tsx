import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { MetaformField, MetaformFieldOption } from "../../../generated/client";
import styles from "../../../styles/generics/editable-field-components/metaform-radio-field-component";

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
    const {
      field,
      fieldId,
      fieldLabelId
    } = this.props;

    const options = field.options || [];

    return (
      <FormControl component="fieldset">
        <FormLabel 
          id={ fieldLabelId }
          component="legend"
        >
          { field.title }
        </FormLabel>
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

export default withStyles(styles)(MetaformRadioFieldComponent)