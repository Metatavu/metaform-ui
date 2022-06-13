import { Box, Button, FormControl, FormLabel, Typography } from "@material-ui/core";
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
 * Component for Metaform addable submit field
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
    <Box
      sx={{
        width: 100,
        height: 100,
        bgcolor: "#ccc",
        textAlign: "center"
      }}
    >
      <Typography variant="body1">
        { strings.addableComponent.submit }
      </Typography>
    </Box>
  );
}

export default MetaformSubmitFieldAddable;