import { FormControl, Typography } from "@material-ui/core";
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
 * Component for Metaform html addable
 */
export class MetaformHtmlAddable extends React.Component<Props, State> {

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
    <FormControl variant="outlined">
      <Typography>
        { `"${strings.editableFields.default.html}"` }
      </Typography>
    </FormControl>
  );
}

export default MetaformHtmlAddable