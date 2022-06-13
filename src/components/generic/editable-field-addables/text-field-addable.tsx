import { Box, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import strings from "../../../localization/strings";
import styles from "../../../styles/generics/editable-field-components/metaform-text-field-component"

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for Metaform text field
 */
export class MetaformTextFieldAddable extends React.Component<Props, State> {

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
        { strings.addableComponent.text }
      </Typography>
    </Box>
  );

}

export default withStyles(styles)(MetaformTextFieldAddable);