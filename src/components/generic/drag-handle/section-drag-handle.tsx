import { Box, IconButton } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "../../../styles/generics/drag-handle/section-drag-handle";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import classNames from "classnames";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  selected: boolean;
  onDeleteClick?: () => void;
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Component for basic section drag handle
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
    const {
      children,
      classes,
      selected,
      onDeleteClick
    } = this.props;

    return (
      <Box className={ classNames(classes.root, { selected: selected }) }>
        { children }
        <Box className={ classNames(classes.dragHandle, { selected: selected }) }>
          { selected && 
            <>
              <DragHandleIcon htmlColor="#fff"/>
              <IconButton 
                disabled={ !!!onDeleteClick }
                style={{ color: "#fff" }}
                onClick={ onDeleteClick }
              >
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