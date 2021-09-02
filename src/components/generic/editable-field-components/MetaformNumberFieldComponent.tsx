import { FormControl, Input, InputLabel, WithStyles, } from '@material-ui/core';
import React from 'react';
import { Metaform, MetaformField } from '../../../generated/client';
import strings from '../../../localization/strings';
import styles from "../../../styles/form-edit-screen";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  metaform: Metaform;
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform number field
 */
export class MetaformNumberFieldComponent extends React.Component<Props, State> {

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

    /**
     * Props for number input
     */
    const inputProps = {
      min: this.props.field.min,
      max: this.props.field.max,
      step: 1
    }

    return (
      <>
        <FormControl>
          <InputLabel
            htmlFor={ this.props.fieldId }
          >
            { strings.editableFields.numberField }
          </InputLabel>
          <Input
            type="number"
            placeholder={ this.props.field.placeholder }
            id={ this.props.fieldId }
            aria-labelledby={ this.props.fieldLabelId }
            name={ this.props.field.name }
            title={ this.props.field.title }
            required={ this.props.field.required }
            readOnly={ this.props.field.readonly }
            inputProps={ inputProps }
            className={ this.props.classes.numberField }
          />
        </FormControl>
        <FormControl>
          <InputLabel
            htmlFor={ this.props.fieldId }
          >
            { strings.editableFields.numberFieldMin }
          </InputLabel>
          <Input
            type="number"
            id={ this.props.fieldId }
            className={ this.props.classes.numberField }
            onChange={ this.handleNumberMinValueChange }
          />
        </FormControl>
        <FormControl>
          <InputLabel
            htmlFor={ this.props.fieldId }
          >
            { strings.editableFields.numberFieldMax }
          </InputLabel>
          <Input
            type="number"
            id={ this.props.fieldId }
            className={ this.props.classes.numberField }
            onChange={ this.handleNumberMaxValueChange }
          />
        </FormControl>
      </>
    );
  }

  /**
   * Event handler for minimum number value change
   * 
   * @param event new min number value
  */ 
  private handleNumberMinValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMetaform = this.props.metaform;
    if (newMetaform.sections){
      newMetaform.sections.forEach(section => {
        section.fields?.forEach(field => {
          if( field.type === "number"){
            field.min = event.target.value as unknown as number;
          }
        })
      });
    }
    this.setState({
      metaform : newMetaform
    })
  }

  /**
   * Event handler for maximum number value change
   * 
   * @param event new max number value
  */ 
  private handleNumberMaxValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMetaform = this.props.metaform;
    if (newMetaform.sections){
      newMetaform.sections.forEach(section => {
        section.fields?.forEach(field => {
          if( field.type === "number"){
            field.max = event.target.value as unknown as number;
          }
        })
      });
    }
    this.setState({
      metaform : newMetaform
    })
  }

}