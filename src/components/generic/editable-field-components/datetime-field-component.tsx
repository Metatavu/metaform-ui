import { MetaformField } from "../../../generated/client";
import React from "react";
import { withStyles } from "@material-ui/styles";
import styles from "../../../styles/generics/editable-field-components/metaform-datetime-field-component";
import { Typography } from "@material-ui/core";
import strings from "../../../localization/strings";

/**
 * Component props
 */
interface Props {
  field: MetaformField
}

/**
 * Component state
 */
interface State {
  
}

/**
 * Component for Metaform editable date time picker
 */
export class MetaformDateTimeFieldComponent extends React.Component<Props, State> {

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
   * 
   * TASK: Finish datetimepicker
   */
  public render() {
    const { field } = this.props;

    if (!this.props.field.name) {
      return null;
    }

    return (
      <Typography variant="body1">
        { field.title } { strings.formEditScreen.notYetSupported }
      </Typography>
    )
  }

}

export default withStyles(styles)(MetaformDateTimeFieldComponent)