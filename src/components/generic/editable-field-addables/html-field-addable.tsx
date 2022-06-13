import { Box, Typography } from "@material-ui/core";
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
 * Component for Metaform addable html addable
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
    <Box
      sx={{
        width: 100,
        height: 100,
        bgcolor: "#ccc",
        textAlign: "center"
      }}
    >
      <Typography variant="body1">
        { strings.addableComponent.html }
      </Typography>
    </Box>
  );
}

export default MetaformHtmlAddable