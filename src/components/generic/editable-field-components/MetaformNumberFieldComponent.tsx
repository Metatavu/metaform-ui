import { FormControl, Input, InputLabel, WithStyles, } from "@material-ui/core";
import React from "react";
import { Metaform, MetaformField } from "../../../generated/client";
import strings from "../../../localization/strings";
import styles from "../../../styles/form-edit-screen";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  field: MetaformField;
  fieldId: string;
  fieldLabelId: string;
  metaform: Metaform;
  onMetaformUpdate: (metaform: Metaform) => void;
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
    const { classes, field, fieldId } = this.props;

    const inputProps = {
      min: field.min,
      max: field.max,
      step: 1
    }

    return (
      <>
        <FormControl>
          <InputLabel
            htmlFor={ fieldId }
          >
            { strings.editableFields.numberField }
          </InputLabel>
          <Input
            type="number"
            placeholder={ field.placeholder }
            id={ fieldId }
            name={ field.name }
            title={ field.title }
            required={ field.required }
            readOnly={ field.readonly }
            inputProps={ inputProps }
            className={ classes.numberField }
          />
        </FormControl>
        <FormControl>
          <InputLabel
            htmlFor={ fieldId }
          >
            { strings.editableFields.numberFieldMin }
          </InputLabel>
          <Input
            type="number"
            id={ fieldId }
            className={ classes.numberField }
            onChange={ this.handleNumberMinValueChange }
          />
        </FormControl>
        <FormControl>
          <InputLabel
            htmlFor={ fieldId }
          >
            { strings.editableFields.numberFieldMax }
          </InputLabel>
          <Input
            type="number"
            id={ fieldId }
            className={ classes.numberField }
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
    const { metaform, onMetaformUpdate } = this.props;
    const changedMetaform = { ...metaform };
    
    if(changedMetaform.sections){
      changedMetaform.sections.forEach(section => {
        section.fields?.forEach(field => {
          if( field.type === "number"){
            field.min = event.target.value as unknown as number;
          }
        })
      });
    }
    
    onMetaformUpdate(changedMetaform);
  }

  /**
   * Event handler for maximum number value change
   * 
   * @param event new max number value
  */ 
  private handleNumberMaxValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedMetaform = { ...this.props.metaform };
    if (changedMetaform.sections){
      changedMetaform.sections.forEach(section => {
        section.fields?.forEach(field => {
          if( field.type === "number"){
            field.max = event.target.value as unknown as number;
          }
        })
      });
    }

    this.props.onMetaformUpdate(changedMetaform);
  }

}