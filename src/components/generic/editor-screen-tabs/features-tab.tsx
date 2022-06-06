import { Box } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import { MetaformField } from "metaform-react";
import React from "react";
import styles from "../../../styles/generics/editor-screen-tabs/component-tab";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
    selectedField?: MetaformField;
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Component for basic section drag handle
 */
class FeaturesTab extends React.Component<Props, State> {

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
    const { classes, selectedField } = this.props;
    console.log(selectedField?.title)
    return (
      <Box className={ classes.componentContainer }>
        <h1>{ selectedField?.title }</h1>
      </Box>
    );
  }

}

export default withStyles(styles)(FeaturesTab);