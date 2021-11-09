import { Button, FormControl, FormLabel } from "@material-ui/core";
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
 * Component for Metaform submit field
 */
export class MetaformSubmitFieldAddable extends React.Component<Props, State> {

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
      <FormLabel>
        { strings.componentTab.label }
      </FormLabel>
      <Button
        variant="contained"
        color="primary"
      >
        { `"${strings.componentTab.submit}"` }
      </Button>
    </FormControl>
  );
}

export default MetaformSubmitFieldAddable;