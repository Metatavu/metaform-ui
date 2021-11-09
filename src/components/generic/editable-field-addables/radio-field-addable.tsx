import { FormControl, FormControlLabel, FormLabel, Radio } from "@material-ui/core";
import React from "react";
import strings from "../../../localization/strings";

/**
 * Component props
 */
interface Props {
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for radio field
 */
export class MetaformRadioFieldAddable extends React.Component<Props, State> {

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
  public render = () => (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        { strings.componentTab.label }
      </FormLabel>
      <FormControlLabel 
        control={ <Radio checked color="primary"/> } 
        label={ `"${strings.componentTab.radio}"` } 
      />
    </FormControl>
  );
}

export default MetaformRadioFieldAddable