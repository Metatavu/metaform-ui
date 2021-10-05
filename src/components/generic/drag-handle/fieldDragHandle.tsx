import { Box, Button } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "../../../styles/generics/drag-handle/fieldDragHandle";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
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
class FieldDragHandle extends React.Component<Props, State> {

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
      <Box className={ classes.root }>
        { children }
        <Box className={ classNames(classes.dragHandle, { selected: selected }) }>
          <Button disabled style={{ color: "#fff" }} startIcon={ <AddIcon/> }/>
          <DragHandleIcon htmlColor="#fff"/>
          <Button disabled style={{ color: "#fff" }} startIcon={ <DeleteIcon/> }/>
        </Box>
      </Box>
    );
  }
}

export default withStyles(styles)(FieldDragHandle);