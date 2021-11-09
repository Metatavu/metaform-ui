import { FormControl, FormLabel, TextField } from "@material-ui/core";
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
 * Component for Metaform number field
 */
export class MetaformNumberFieldAddable extends React.Component<Props, State> {

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
    <FormControl>
      <FormLabel>{ strings.componentTab.label }</FormLabel>
      <TextField
        variant="standard"
        value=""
        placeholder={ `"${strings.componentTab.number}"` }
        onChange={ this.onChange }
      />
    </FormControl>
  );

  /**
   * On change event handler
   * 
   * @param event event 
   */
  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }
}

export default MetaformNumberFieldAddable;