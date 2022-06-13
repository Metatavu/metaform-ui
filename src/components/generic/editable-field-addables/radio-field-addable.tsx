import { Box, FormControl, FormControlLabel, FormLabel, Radio, Typography } from "@material-ui/core";
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
 * Component for Metaform addable radio field
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
    <Box
      sx={{
        width: 100,
        height: 100,
        bgcolor: "#ccc",
        textAlign: "center"
      }}
    >
      <Typography variant="body1">
        { strings.addableComponent.radio }
      </Typography>
    </Box>
  );
}

export default MetaformRadioFieldAddable