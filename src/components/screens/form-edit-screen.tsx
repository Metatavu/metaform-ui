import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-edit-screen";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import InfoIcon from "@material-ui/icons/Info";
import { History } from "history";
import { WithStyles, withStyles, Grid, Box, Typography, List, ListItemText, InputLabel, OutlinedInput, FormControl } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken } from "../../types";
import Api from "../../api/api";
import { Metaform, MetaformField, MetaformSection, MetaformFieldType } from "../../generated/client";
import strings from "../../localization/strings";
import Config from "../../config";
import AdminLayoutV2 from "../layouts/admin-layout-v2";
import { loadMetaform, setMetaform } from "../../actions/metaform";
import { MetaformTextFieldComponent } from "../generic/editable-field-components/MetaformTextFieldComponent";
import { MetaformHtmlComponent } from "../generic/editable-field-components/MetaformHtmlFieldComponent";
import { MetaformRadioFieldComponent } from "../generic/editable-field-components/MetaformRadioFieldComponent";
import { MetaformSubmitFieldComponent } from "../generic/editable-field-components/MetaformSubmitFieldComponent";
import { MetaformNumberFieldComponent } from "../generic/editable-field-components/MetaformNumberFieldComponent";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  signedToken: AccessToken;
  metaform?: Metaform;
  metaformIsLoading: boolean;
  contexts?: string[];
  onLoadMetaform: () => void;
  onSetMetaform: (metaform?: Metaform) => void;
}

/**
 * Component state
 */
interface State {
  error?: string | Error | Response;
  value:string;
  readOnly: boolean;
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
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const {
      metaform,
      signedToken, 
      metaformIsLoading,
      onLoadMetaform,
      onSetMetaform,
    } = this.props;

    if (metaformIsLoading || metaform) {
      return;
    }

    try {
      onLoadMetaform();

      const metaformsApi = Api.getMetaformsApi(signedToken);

      // Load test metaform
      const loadedMetaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });

      onSetMetaform(loadedMetaform);
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
    const { error } = this.state;
    const {
      classes,
      keycloak,
      metaform,
      metaformIsLoading
    } = this.props;

    return (
      <AdminLayoutV2
        keycloak={ keycloak }
        metaform={ metaform }
        loading={ metaformIsLoading || !metaform }
        error={ error }
        clearError={ this.clearError }
      >
        <Grid container className={ classes.root }>
          { this.renderLeftSideBar() }
          { this.renderFormEditor() }
          { this.renderRightSideBar() }
        </Grid>
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
   * Method for rendering left sidebar
   */
  private renderLeftSideBar = () => {
    const { classes } = this.props;

    return (
      <Grid item md={ 2 } className={ classes.sideBar }>
        <Grid item md={ 6 } className={ classes.sideBarTabs }>
          <Typography variant="h5">
            { strings.formEditScreen.leftSideBarComponentsTab }
          </Typography>
        </Grid>
        <Grid item md={ 6 } className={ classes.sideBarTabs }>
          <Typography variant="h5">
            { strings.formEditScreen.leftSideBarStylingTab }
          </Typography>
        </Grid>
        <hr />
        <Typography variant="caption">
          <InfoIcon />
          { strings.formEditScreen.leftSideBarInfo }
        </Typography>
        { this.renderFields() }
        { this.renderComponents() }
      </Grid>
    );
  }

  /**
   * Method for rendering right sidebar
   */
  private renderRightSideBar = () => {
    const { classes } = this.props;

    return (
      <Grid item md={ 2 } className={ classes.sideBar }>
        <Grid item md={ 6 } className={ classes.sideBarTabs }>
          <Typography variant="h5">
            { strings.formEditScreen.rightSideBarLinksTab }
          </Typography>
        </Grid>
        <Grid item md={ 6 } className={ classes.sideBarTabs }>
          <Typography variant="h5">
          { strings.formEditScreen.rightSideBarVisibilityTab }
          </Typography>
        </Grid>
        <hr />
        <Typography variant="caption">
          <InfoOutlinedIcon color="disabled" />
          { strings.formEditScreen.chooseComponent }
        </Typography>
      </Grid>
    );
  }

  /**
   * Method for rendering addable fields
   */
  private renderFields = () => {
    const listOfFields = [
      strings.formEditScreen.sectionLayout,
      strings.formEditScreen.headerField,
      strings.formEditScreen.textField,
      strings.formEditScreen.editableTextField,
      strings.formEditScreen.conditionalField
    ];

    const { classes } = this.props;

    return (
      <List>
        <Box border={ 1 } className={ classes.fieldHeader }>
          <ListItemText>
            <Typography>
              { strings.formEditScreen.leftSideBarFieldHeader }
            </Typography>
          </ListItemText>
        </Box>
        { listOfFields.map((field: string, index: number) => (
          <Box border={ 1 } className={ classes.fields } key={ index } >
            <ListItemText>
              <Typography>{ field }</Typography>
            </ListItemText>
          </Box>
        )) }
      </List>
    );
  }

  /**
   * Method for rendering addable components
   */
  private renderComponents = () => {
    const listOfComponents = [
      strings.formEditScreen.dropDownMenu,
      strings.formEditScreen.selectBox,
      strings.formEditScreen.radioButton,
      strings.formEditScreen.button,
      strings.formEditScreen.image
    ];

    const { classes } = this.props;

    return (
      <List>
        <Box border={ 1 } className={ classes.componentHeader }>
          <ListItemText>
            <Typography>
              { strings.formEditScreen.leftSideBarComponentHeader }
            </Typography>
          </ListItemText>
        </Box>
        { listOfComponents.map((component: string, index: number) => (
          <Box border={ 1 } className={ classes.fields } key={ index }>
            <ListItemText>
              <Typography>{ component }</Typography>
            </ListItemText>
          </Box>
        )) }
      </List>
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
    metaformIsLoading: state.metaform.isLoading
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    onLoadMetaform: () => dispatch(loadMetaform()),
    onSetMetaform: (metaform?: Metaform) => dispatch(setMetaform(metaform)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FormEditScreen));
