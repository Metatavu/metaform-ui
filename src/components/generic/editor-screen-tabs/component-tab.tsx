import { Box } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "../../../styles/generics/editor-screen-tabs/component-tab";
import classNames from "classnames";
import { Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";
import { MetaformFieldType } from "../../../generated/client";
import { MetaformHtmlAddable, MetaformNumberFieldAddable, MetaformRadioFieldAddable, MetaformSubmitFieldAddable, MetaformTextFieldAddable } from "../editable-field-addables";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Component for basic section drag handle
 */
class ComponentTab extends React.Component<Props, State> {

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
    const { classes } = this.props;

    return (
      <Box className={ classes.componentContainer }>
        <Droppable droppableId="componentList" isDropDisabled>
          {(provided:DroppableProvided, snapshot:DroppableStateSnapshot) => (
            <div
              ref={ provided.innerRef }
            >
              { Object.values(MetaformFieldType).map(this.renderDraggableComponent) }
            </div>
          )}
        </Droppable>
      </Box>
    );
  }

  /**
   * Renders a single draggable component
   * 
   * @param fieldType field type
   * @param index index
   */
  private renderDraggableComponent = (fieldType: MetaformFieldType, index: number) => {
    const { classes } = this.props;

    return (
      <Draggable draggableId={ fieldType } index={ index }>
        {(providedDraggable:DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
            <>
              <div
                className={ classes.singleDraggableComponent }
                ref={ providedDraggable.innerRef }
                { ...providedDraggable.draggableProps }
                { ...providedDraggable.dragHandleProps }
              >
                { this.renderComponent(fieldType) }
              </div>
              { snapshotDraggable.isDragging &&
                <div 
                  className={ classNames(classes.singleDraggableComponent, { clone : true }) }
                > 
                  { this.renderComponent(fieldType) }
                </div> 
              }
            </>
          )}
      </Draggable>
    );
  }

  /**
   * Renders form editor sample component
   * 
   * @param fieldType metaform field type
   */
  private renderComponent = (fieldType: MetaformFieldType) => {
    // Task replace the rendering method to use only visual display component & add all the component

    switch (fieldType) {
      case MetaformFieldType.Text:
        return (
          <MetaformTextFieldAddable/>
        );
      case MetaformFieldType.Html:
        return (
          <MetaformHtmlAddable/>
        );
      case MetaformFieldType.Radio:
        return (
          <MetaformRadioFieldAddable/>
        );
      case MetaformFieldType.Submit:
        return (
          <MetaformSubmitFieldAddable/>
        );
      case MetaformFieldType.Number:
        return (
          <MetaformNumberFieldAddable/>
        );
      default:
        return null;
    }
  }
}

export default withStyles(styles)(ComponentTab);