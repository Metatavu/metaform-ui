import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-edit-screen";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import InfoIcon from "@material-ui/icons/Info";
import { History } from "history";
import { WithStyles, withStyles, Grid, Box, Typography, List, ListItemText, InputLabel, OutlinedInput, FormControl, Drawer, Toolbar, Divider } from "@material-ui/core";
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
  value:string;
  readOnly: boolean;
  isLoading: boolean;
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
      isLoading: false
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
        <DragDropContext onDragEnd={ (result: DropResult, provided: ResponderProvided) => {} }>
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
      <Grid item md={ 8 } className={ classes.formEditor }>
        <Box className={ classes.editableForm }>
          { this.renderMainHeader() }
          { metaform.sections?.map((section, i) => {
            return (
              <div key={ i } className={ classes.editableSections }>
                { this.renderFormFields(section, i) }
              </div> 
            );
          })}
        </Box>
      </Grid>
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
  private renderFormFields = (section: MetaformSection, sectionIndex: number) => {
    const { classes } = this.props;
    
    return (
      <FormControl>
        {
          section.fields?.map((field, i) => {
            return (
              <div key={ i } className={ classes.editableField }>
                { this.renderInput(field, sectionIndex, i) }
              </div>
            )
          })
        }
      </FormControl>
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

    return (
      <Drawer
        open
        anchor="left"
        variant="persistent"
        className={ classes.drawer }
        classes={{ paper: classes.drawerPaper }}
      >
        <Toolbar/>
        <Box className={ classes.drawerTabs }>
          <Box className={ classes.drawerTab }>
            <Typography variant="h5">
              { strings.formEditScreen.componentsTab }
            </Typography>
          </Box>
          <Box className={ classes.drawerTab }>
            <Typography variant="h5">
              { strings.formEditScreen.stylingTab }
            </Typography>
          </Box>
        </Box>
        <Divider/>
        <Typography variant="caption">
          <InfoIcon />
          { strings.formEditScreen.leftSideBarInfo }
        </Typography>
        { this.renderDraggableComponents() }
      </Drawer>
    );
  }

  /**
   * Method for rendering right sidebar
   */
  private renderRightDrawer = () => {
    const { classes } = this.props;

    return (
      <Drawer
        open
        anchor="right"
        variant="persistent"
        className={ classes.drawer }
        classes={{ paper: classes.drawerPaper }}
      >
        <Toolbar/>
        <Box className={ classes.drawerTabs }>
          <Box className={ classes.drawerTab }>
            <Typography variant="h5">
              { strings.formEditScreen.rightSideBarLinksTab }
            </Typography>
          </Box>
          <Box className={ classes.drawerTab }>
            <Typography variant="h5">
              { strings.formEditScreen.rightSideBarVisibilityTab }
            </Typography>
          </Box>
        </Box>
        <Divider/>
        <Typography variant="caption">
          <InfoOutlinedIcon color="disabled" />
          { strings.formEditScreen.chooseComponent }
        </Typography>
      </Drawer>
    );
  }

  /**
   * Renders draggable components
   */
  private renderDraggableComponents = () => {
    const { classes } = this.props;

    return (
        <Droppable droppableId="componentList">
          {(provided:DroppableProvided, snapshot:DroppableStateSnapshot) => (
            <div
              ref={ provided.innerRef }
              { ...provided.droppableProps }
            >
              { Object.values(MetaformFieldType).map(this.renderDraggableComponent) }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
    );
  }

  /**
   * Renders single draggable component
   */
  private renderDraggableComponent = (fieldType: MetaformFieldType) => {
    const { classes } = this.props;

    // TODO fix the index
    return (
      <Draggable draggableId={ fieldType } index={ 0 }>
        {(providedDraggable:DraggableProvided, snapshotDraggable:DraggableStateSnapshot) => (
            <div>
              <div
                ref={ providedDraggable.innerRef }
                { ...providedDraggable.draggableProps }
                { ...providedDraggable.dragHandleProps }
              >
                { this.renderReadOnlyInput(fieldType) }
              </div>
            </div>
          )}
      </Draggable>
    );
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
