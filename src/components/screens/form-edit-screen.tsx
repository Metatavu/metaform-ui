import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-edit-screen";
import { History } from "history";
import { WithStyles, withStyles, Box, InputLabel, OutlinedInput, FormControl, Drawer, Toolbar, Divider, Paper, Tabs, Tab, Typography, Button } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken, EditorNavigationLinks } from "../../types";
import Api from "../../api/api";
import { Metaform, MetaformField, MetaformSection, MetaformFieldType } from "../../generated/client";
import strings from "../../localization/strings";
import Config from "../../config";
import AdminLayoutV2 from "../layouts/admin-layout-v2";
import { setMetaform } from "../../actions/metaform";
import { MetaformTextFieldComponent } from "../generic/editable-field-components/MetaformTextFieldComponent";
import { MetaformHtmlComponent } from "../generic/editable-field-components/MetaformHtmlFieldComponent";
import { MetaformRadioFieldComponent } from "../generic/editable-field-components/MetaformRadioFieldComponent";
import { MetaformSubmitFieldComponent } from "../generic/editable-field-components/MetaformSubmitFieldComponent";
import { MetaformNumberFieldComponent } from "../generic/editable-field-components/MetaformNumberFieldComponent";
import { DragDropContext, Draggable, Droppable, DroppableProvided, DraggableLocation, DropResult, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot, ResponderProvided } from 'react-beautiful-dnd';
import classNames from "classnames";
import MetaformUtils from "../../utils/metaform";
import AddIcon from "@material-ui/icons/Add";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  signedToken: AccessToken;
  metaform?: Metaform;
  contexts?: string[];
  onSetMetaform: (metaform?: Metaform) => void;
}

/**
 * Component state
 */
interface State {
  error?: string | Error | Response;
  value: string;
  readOnly: boolean;
  isLoading: boolean;
  leftDrawerTabIndex: number;
  rightDrawerTabIndex: number;
}

/**
 * Component for editing Metaform
 */
export class FormEditScreen extends React.Component<Props, State> {
  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      value: "",
      readOnly: true,
      isLoading: false,
      leftDrawerTabIndex: 0,
      rightDrawerTabIndex: 0
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const {
      metaform,
      signedToken, 
      onSetMetaform,
    } = this.props;

    if (metaform) {
      return;
    }

    try {
      this.setState({
        isLoading: true
      });

      const metaformsApi = Api.getMetaformsApi(signedToken);

      // Load test metaform
      const loadedMetaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });

      onSetMetaform(loadedMetaform);

      this.setState({
        isLoading: false
      });
    } catch (e) {
      this.setState({
        error: e
      });

      onSetMetaform(undefined);
    }
  };

  /**
   * Component render method
   */
  public render = () => {
    const { error, isLoading } = this.state;
    const {
      classes,
      keycloak,
      metaform,
    } = this.props;

    return (
      <AdminLayoutV2
        keycloak={ keycloak }
        metaform={ metaform }
        loading={ isLoading || !metaform }
        error={ error }
        clearError={ this.clearError }
        activeNavigationLink={ EditorNavigationLinks.form }
      >
        <DragDropContext onDragEnd={ this.onDragEnd }>
          <Box className={ classes.root }>
            { this.renderFormEditor() }
          </Box>
          { this.renderLeftDrawer() }
        </DragDropContext>
        { this.renderRightDrawer() }
      </AdminLayoutV2>
    );
  };

  /**
   * Method for rendering form editor
   */
  private renderFormEditor = () => {
    const { classes, metaform } = this.props;

    if (!metaform) {
      return;
    }

    return (
      <Box className={ classes.formEditor }>
        { this.renderMainHeader() }
        { metaform.sections?.map((section, sectionIndex) => 
          this.renderFormSection(section, sectionIndex)) 
        }
        <Button 
          variant="text"
          startIcon={ <AddIcon/> }
          onClick={ this.onAddNewSectionClick }
          className={ classes.addNewSectionButton }
        >
          <Typography>
            { strings.formEditScreen.addNewSection }
          </Typography>
        </Button>
      </Box>
    );
  }

  /**
   * Renders main header
   */
  private renderMainHeader = () => {
    const { classes, metaform } = this.props;

    if (!metaform) {
      return;
    }

    return (
      <FormControl variant="outlined" className={ classes.mainHeader }>
        <InputLabel htmlFor="mainHeaderField">{ strings.formEditScreen.formMainHeader }</InputLabel>
        <OutlinedInput
          label={ strings.formEditScreen.formMainHeader }
          id="mainHeaderField"
          color="secondary"
          value={ metaform.title }
          onChange={ this.handleInputTitleChange }
        />
      </FormControl>
    );
  }

  /**
   * Method for rendering form fields
   * 
   * @param section metaform section
   * @param sectionIndex section index
   */
  private renderFormSection = (section: MetaformSection, sectionIndex: number) => {
    const { classes } = this.props;
    
    console.log("rendering section", section)

    return (
      <Paper className={ classes.formEditorSection }>
        <Droppable droppableId={ sectionIndex.toString() }>
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <>
              <div ref={ provided.innerRef } >
                { (section.fields && section.fields.length > 0) ?
                  section.fields.map((field, index) => this.renderFormField(field, sectionIndex, index)) :
                  !provided.placeholder && <Typography>
                    { strings.formEditScreen.emptySection }
                  </Typography>
                }
                { provided.placeholder }
              </div>
            </>
          )}
        </Droppable>
      </Paper>
    );
  }

  /**
   * Method for rendering form fields
   * 
   * @param section metaform section
   * @param sectionIndex section index
   */
  private renderFormField = (field: MetaformField, sectionIndex: number, fieldIndex: number) => {
    const { classes } = this.props;
    
    return (
      <Draggable draggableId={ `field-${sectionIndex.toString()}-${fieldIndex.toString()}` } index={ fieldIndex }>
        {(providedDraggable:DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
          <div
            ref={ providedDraggable.innerRef }
            { ...providedDraggable.draggableProps }
            { ...providedDraggable.dragHandleProps }
          >
            <Box className={ classes.formEditorField }>
              { this.renderInput(field, sectionIndex, fieldIndex) }
            </Box>
          </div>
        )}
      </Draggable>
    );
  }

  /**
  * Renders field's input
  * 
  * @param field metaform field
  * @param sectionIndex section index
  * @param fieldIndex field index
  */
  private renderInput = (field: MetaformField, sectionIndex: number, fieldIndex: number) => {
    const { classes, metaform } = this.props;

    if (!metaform) {
      return;
    }

    switch (field.type) {
      case MetaformFieldType.Text:
        return (
          <MetaformTextFieldComponent
            field={ field }
            onFieldUpdate={ this.onFieldUpdate(sectionIndex, fieldIndex) }
          />
        );
      case MetaformFieldType.Html:
        return (
          <MetaformHtmlComponent
            fieldLabelId={ this.getFieldLabelId(field) }
            fieldId={ this.getFieldId(field) }
            field={ field }
            classes={ classes }
            fieldName={ field.name }
            onFieldUpdate={ this.onFieldUpdate(sectionIndex, fieldIndex) }
          />
        );
      case MetaformFieldType.Radio:
        return (
          <MetaformRadioFieldComponent
            fieldLabelId={ this.getFieldLabelId(field) }
            fieldId={ this.getFieldId(field) }
            field={ field }
            onFieldUpdate={ this.onFieldUpdate(sectionIndex, fieldIndex) }
          />
        );
      case MetaformFieldType.Submit:
        return (
          <MetaformSubmitFieldComponent
            fieldId={ this.getFieldId(field) }
            field={ field }
            onFieldUpdate={ this.onFieldUpdate(sectionIndex, fieldIndex) }
          />
        );
      case MetaformFieldType.Number:
        return (
          <MetaformNumberFieldComponent
            fieldLabelId={ this.getFieldLabelId(field) }
            fieldId={ this.getFieldId(field) }
            field={ field }
            classes={ classes }
            onFieldUpdate={ this.onFieldUpdate(sectionIndex, fieldIndex) }
          />
        );
      default:
        return (
          <div style={{ color: "red" }}> 
            `${ strings.formEditScreen.unknownFieldType }: ${ field.type }` 
          </div>
        );
    }
  }

/**
  * Renders field's input
  * 
  * @param field metaform field
  * @param sectionIndex section index
  * @param fieldIndex field index
  */
  private renderReadOnlyInput = (fieldType: MetaformFieldType) => {
    const { classes, metaform } = this.props;

    if (!metaform) {
      return;
    }

    switch (fieldType) {
      case MetaformFieldType.Text:
        return (
          <MetaformTextFieldComponent
            formReadOnly={ true }
          />
        );
      case MetaformFieldType.Html:
        return (
          <MetaformHtmlComponent
            formReadOnly={ true } 
            classes={ classes }          
          />
        );
      case MetaformFieldType.Radio:
        return (
          <MetaformRadioFieldComponent
            formReadOnly={ true }
          />
        );
      case MetaformFieldType.Submit:
        return (
          <MetaformSubmitFieldComponent
            formReadOnly={ true }
          />
        );
      case MetaformFieldType.Number:
        return (
          <MetaformNumberFieldComponent
            formReadOnly={ true }
            classes={ classes }
          />
        );
      default:
        return (
          <div style={{ color: "red" }}> 
            `${ strings.formEditScreen.unknownFieldType }: ${ fieldType }` 
          </div>
        );
    }
  }

  /**
   * Method for rendering left sidebar
   */
  private renderLeftDrawer = () => {
    const { classes } = this.props;
    const { leftDrawerTabIndex } = this.state;

    return (
      <Drawer
        open
        anchor="left"
        variant="persistent"
        className={ classes.drawer }
        classes={{ paper: classes.drawerPaper }}
      >
        <Toolbar/>
        <Tabs
          onChange={ (event, value: number) => this.setLeftDrawerTabIndex(value) }
          value={ leftDrawerTabIndex }
        >
          <Tab
            fullWidth
            value={ 0 }
            label={ strings.formEditScreen.componentsTab }
          />
          <Tab
            fullWidth
            value={ 1 }
            label={ strings.formEditScreen.stylingTab }
          />
        </Tabs>
        <Box className={ classes.drawerContent }>
          { leftDrawerTabIndex === 0 &&
            this.renderDraggableComponents()
          }
        </Box>
      </Drawer>
    );
  }

  /**
   * Method for rendering right sidebar
   */
  private renderRightDrawer = () => {
    const { classes } = this.props;
    const { rightDrawerTabIndex } = this.state;

    return (
      <Drawer
        open
        anchor="right"
        variant="persistent"
        className={ classes.drawer }
        classes={{ paper: classes.drawerPaper }}
      >
        <Toolbar/>
        <Tabs
          onChange={ (event, value: number) => this.setRightDrawerTabIndex(value) }
          value={ rightDrawerTabIndex }
        >
          <Tab
            fullWidth
            value={ 0 }
            label={ strings.formEditScreen.linksTab }
          />
          <Tab
            fullWidth
            value={ 1 }
            label={ strings.formEditScreen.visibilityTab }
          />
        </Tabs>
        <Divider/>
      </Drawer>
    );
  }

  /**
   * Renders draggable components
   */
  private renderDraggableComponents = () => {
    const { classes } = this.props;

    return (
      <Box className={ classes.componentsContainer }>
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
   * Renders single draggable component
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
                { this.renderReadOnlyInput(fieldType) }
              </div>
              { snapshotDraggable.isDragging &&
                <div 
                  className={ classNames(classes.singleDraggableComponent, { clone : true }) }
                > 
                  { this.renderReadOnlyInput(fieldType) }
                </div> 
              }
            </>
          )}
      </Draggable>
    );
  }

  /**
   * Component on drag end event handler
   * 
   * @param field metaform field
   *
   * @returns field's id 
   */
  private onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { draggableId, source, destination } = result;

    console.log("result", result)
    console.log("provided", provided)

    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case "componentList":
        this.onComponentListCreate(
          draggableId as MetaformFieldType,
          source,
          destination
        );
        break;
      default:
        this.onComponentListMove(
          source,
          destination
        )
        break;
    }
  }

  /**
   * Component on drag end event handler
   * 
   * @param field metaform field
   *
   * @returns field's id 
   */
  private onComponentListCreate = (fieldType: MetaformFieldType, droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
    const { metaform, onSetMetaform } = this.props;
    const defaultField = MetaformUtils.metaformDefaultField(fieldType);
    const sectionId = parseInt(droppableDestination.droppableId);
    const fieldId = droppableDestination.index;

    if (!metaform?.sections || sectionId < 0) {
      return;
    }

    const updatedSection = { ...metaform.sections[sectionId] };
    updatedSection.fields?.splice(fieldId, 0, defaultField)
    const updatedSections = [ ...metaform.sections ];
    updatedSections.splice(sectionId, 1, updatedSection);


    const updatedMetaform = { 
      ...metaform,
      sections: updatedSections 
    } as Metaform;

    onSetMetaform(updatedMetaform);
  }

  /**
   * Component on drag end event handler
   * 
   * @param field metaform field
   *
   * @returns field's id 
   */
  private onComponentListMove = (droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
    const { metaform, onSetMetaform } = this.props;
    const fromSectionId = parseInt(droppableSource.droppableId);
    const toSectionId = parseInt(droppableDestination.droppableId);

    if (!metaform?.sections || fromSectionId < 0 || toSectionId < 0) {
      return;
    }

    const fromFieldId = droppableSource.index;
    const toFieldId = droppableDestination.index;

    const updatedMetaform = { ...metaform };
    const draggedField = updatedMetaform!.sections![fromSectionId].fields![fromFieldId];
    updatedMetaform!.sections![fromSectionId].fields?.splice(fromFieldId, 1);
    updatedMetaform!.sections![toSectionId].fields?.splice(toFieldId, 0, draggedField);

    onSetMetaform(updatedMetaform);
  }


  /**
   * Event handler for main header change
   * 
   * @param event new main header value
   */
  private setLeftDrawerTabIndex = (newLeftDrawerTabIndex: number) => {
    this.setState({
      leftDrawerTabIndex: newLeftDrawerTabIndex
    });
  }

  /**
   * Event handler for main header change
   * 
   * @param event new main header value
   */
  private setRightDrawerTabIndex = (newRightDrawerTabIndex: number) => {
    this.setState({
      rightDrawerTabIndex: newRightDrawerTabIndex
    });
  }

  /**
   * Event handler for main header change
   * 
   * @param event new main header value
   */
  private handleInputTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { metaform, onSetMetaform } = this.props;

    onSetMetaform({
      ...metaform, 
      title: event.target.value
    } as Metaform);
  }

  /**
   * Event handler for field update
   * 
   * @param sectionIndex  section index
   * @param fieldIndex field index
   */
  private onFieldUpdate = (sectionIndex: number, fieldIndex: number) => (newMetaformField: MetaformField) => {
    const { metaform, onSetMetaform } = this.props;

    if (!metaform) {
      return;
    }

    const updatedMetaform = {
      ...metaform
    } as Metaform;

    if (!updatedMetaform?.sections || !updatedMetaform.sections[sectionIndex]) {
      return;
    }

    const fields = updatedMetaform.sections[sectionIndex].fields;

    if (!fields || !fields[fieldIndex]) {
      return;
    }

    fields[fieldIndex] = newMetaformField;

    onSetMetaform(updatedMetaform);
  }

  /**
   * Returns field's id
   * 
   * @param field metaform field
   *
   * @returns field's id 
   */
  private onAddNewSectionClick = () => {
    const { metaform, onSetMetaform } = this.props;

    const createdSection = MetaformUtils.metaformDefaultSection();
    const updatedMetaform = { ...metaform } as Metaform;

    if (!updatedMetaform.sections) {
      return;
    }

    updatedMetaform.sections = [ ...updatedMetaform.sections, createdSection ];

    onSetMetaform(updatedMetaform);
  }

  /**
   * Returns field's id
   * 
   * @param field metaform field
   *
   * @returns field's id 
   */
  private getFieldId = (field : MetaformField) => {
    return `${ Config.getMetaformId() }-field-${ field.name }`;
  }

  /**
   * Returns field label's id
   * 
   * @param field metaform field
   *
   * @returns field label's id 
   */
  private getFieldLabelId = (field : MetaformField) => {
    return `${this.getFieldId(field)}-label`;
  }

  /**
   * Clears error
   */
  private clearError = () => {
    this.setState({
      error: undefined,
    });
  };

}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 */
function mapStateToProps(state: ReduxState) {
  return {
    keycloak: state.auth.keycloak as KeycloakInstance,
    signedToken: state.auth.signedToken as AccessToken,
    metaform: state.metaform.metaform,
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    onSetMetaform: (metaform?: Metaform) => dispatch(setMetaform(metaform)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FormEditScreen));
