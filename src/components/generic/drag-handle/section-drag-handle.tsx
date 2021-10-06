import { Box, IconButton } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "../../../styles/generics/drag-handle/section-hrag-handle";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import classNames from "classnames";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  selected: boolean;
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Component for basic application layout
 */
class SectionDragHandle extends React.Component<Props, State> {

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
    const { children, classes, selected } = this.props;

    return (
      <Box className={ classNames(classes.root, { selected: selected }) }>
        { children }
        <Box className={ classNames(classes.dragHandle, { selected: selected }) }>
          { selected && 
            <>
              <DragHandleIcon htmlColor="#fff"/>
              <IconButton disabled style={{ color: "#fff" }}>
                <DeleteIcon/>
              </IconButton>
            </>
          }
        </Box>
      </Box>
    );
  }
}

export default withStyles(styles)(SectionDragHandle);