import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-edit-screen";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoIcon from '@material-ui/icons/Info';

import { History } from "history";
import { WithStyles, withStyles, Grid, Box, Typography, List, ListItemText, InputLabel, OutlinedInput, FormControl } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken, FieldValue, } from '../../types';
import Api from "../../api/api";
import { Metaform, MetaformField, MetaformSection, MetaformFieldType } from "../../generated/client";
import strings from "../../localization/strings";
import Config from "../../config";
import AdminLayoutV2 from "../layouts/admin-layout-v2";
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
  contexts?: string[];
}

/**
 * Component state
 */
interface State {
  error?: string | Error | Response;
  loading: boolean;
  metaform: Metaform;
  value: string;
  readOnly: boolean;
  sections?: MetaformSection[],
  metaformId?: string
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
      loading: false,
      value: "",
      readOnly: true,
      sections: [],
      metaform: {}
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const { signedToken } = this.props;

    try {
      this.setState({
        loading: true
      });

      const metaformsApi = Api.getMetaformsApi(signedToken);

      /**
       * Load test metaform
       */
      const metaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });

      this.setState({
        loading: false,
        metaform: metaform,
        metaformId: metaform.id,
        sections: metaform.sections || []
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  };

  /**
   * Component render method
   */
  public render = () => {
    const { metaform, loading, error } = this.state;

    const { classes, keycloak } = this.props;

    return (
      <AdminLayoutV2
        keycloak={ keycloak }
        metaform={ metaform }
        loading={ loading || !metaform }
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
    return (
      <Grid item md={ 8 } className={ this.props.classes.formEditor }>
        <Box className={ this.props.classes.editableForm }>
          { this.renderMainHeader() }
          { this.state.sections?.map((section, i) => {
            return (
              <section key={ i }>
                { this.renderFormFields(section) }
              </section> 
            );
          })}
        </Box>
      </Grid>
    )
  }

  /**
   * Renders main header
   * 
   * @returns Metaform main header
   */
  private renderMainHeader = () => (
    <FormControl variant="outlined" className={ this.props.classes.mainHeader }>
      <InputLabel htmlFor="mainHeaderField">{ strings.formEditScreen.formMainHeader }</InputLabel>
      <OutlinedInput
        label={ strings.formEditScreen.formMainHeader }
        id="mainHeaderField"
        color="secondary"
        value={ this.state.metaform.title }
        onChange={ this.handleInputTitleChange }
      />
    </FormControl>
  )

  /**
   * Event handler for main header change
   * 
   * @param event new main header value
   */
  private handleInputTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMetaform = this.state.metaform;
    newMetaform.title = event.target.value;
    this.setState({
      metaform : newMetaform
    })
  }

  /**
   * Method for rendering form fields
   */
  private renderFormFields = (section : MetaformSection) => (
    <fieldset>
      {
        section.fields?.map((field : MetaformField, i : number) => {
          return (
            <div key={ i } >
              { this.renderInput(field, i) }
            </div>
          )
        })
      }
    </fieldset>
  );

  /**
  * Renders field's input
  */
  private renderInput = (field : MetaformField, i : number) => {
  switch (field.type) {
    case MetaformFieldType.Text:
      return  <MetaformTextFieldComponent
                field={ field }
              />;
    case MetaformFieldType.Html:
      return  <MetaformHtmlComponent
                fieldLabelId={ this.getFieldLabelId(field) }
                fieldId={ this.getFieldId(field) }
                field={ field }
                metaform={ this.state.metaform }
                classes={ this.props.classes }
                fieldName={ field.name }
              />;
    case MetaformFieldType.Radio:
      return  <MetaformRadioFieldComponent
                formReadOnly={ this.state.readOnly }
                fieldLabelId={ this.getFieldLabelId(field) }
                fieldId={ this.getFieldId(field) }
                field={ field }
                value="test"
              />;
    case MetaformFieldType.Submit:
      return  <MetaformSubmitFieldComponent
                fieldLabelId={ this.getFieldLabelId(field) }
                fieldId={ this.getFieldId(field) }
                field={ field }
                value="test"
              />;
    case MetaformFieldType.Number:
      return  <MetaformNumberFieldComponent
                fieldLabelId={ this.getFieldLabelId(field) }
                fieldId={ this.getFieldId(field) }
                field={ field }
              />;
      default:
        return <div style={{ color: "red" }}> 
                { strings.formEditScreen.unknownFieldType }: { field.type } 
              </div>;
          
    }
  }

  /**
  * Returns field's id
  */
  private getFieldId = (field : MetaformField) => {
    return `${ this.state.metaformId }-field-${ field.name }`;
  }

  /**
  * Returns field label's id
  */
  private getFieldLabelId = (field : MetaformField) => {
    return `${this.getFieldId(field)}-label`;
  }

  /**
   * Returns field's value
   * 
   * @returns field's value
   */
  private getFieldValue = (field : MetaformField): FieldValue => {
    if (!field) {
      return null;
    }

    const result = this.getFieldValue(field);
    if (!result && field._default) {
      return field._default;
    }

    return result;
  }

  /**
   * Method for rendering left sidebar
   */
  private renderLeftSideBar = () => (
    <Grid item md={ 2 } className={ this.props.classes.sideBar }>
      <Grid item md={ 6 } className={ this.props.classes.sideBarTabs }>
        <Typography variant="h5">
          { strings.formEditScreen.leftSideBarComponentsTab }
        </Typography>
      </Grid>
      <Grid item md={ 6 } className={ this.props.classes.sideBarTabs }>
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

  /**
   * Method for rendering right sidebar
   */
  private renderRightSideBar = () => (
    <Grid item md={ 2 } className={ this.props.classes.sideBar }>
      <Grid item md={ 6 } className={ this.props.classes.sideBarTabs }>
        <h5>{ strings.formEditScreen.rightSideBarLinksTab }</h5>
      </Grid>
      <Grid item md={ 6 } className={ this.props.classes.sideBarTabs }>
        <h5>{ strings.formEditScreen.rightSideBarVisibilityTab }</h5>
      </Grid>
      <hr />
      <Typography variant="caption">
        <InfoOutlinedIcon color="disabled" />
        { strings.formEditScreen.chooseComponent }
      </Typography>
    </Grid>
  );

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

    return (
      <List>
        <Box border={ 1 } className={ this.props.classes.fieldHeader }>
          <ListItemText>
            <Typography>
              { strings.formEditScreen.leftSideBarFieldHeader }
            </Typography>
          </ListItemText>
        </Box>
        { listOfFields.map((field: string, index: number) => (
          <Box border={ 1 } className={ this.props.classes.fields } key={ index } >
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

    return (
      <List>
        <Box border={ 1 } className={ this.props.classes.componentHeader }>
          <ListItemText>
            <Typography>
              { strings.formEditScreen.leftSideBarComponentHeader }
            </Typography>
          </ListItemText>
        </Box>
        { listOfComponents.map((component: string, index: number) => (
          <Box border={ 1 } className={ this.props.classes.fields } key={ index }>
            <ListItemText>
              <Typography>{ component }</Typography>
            </ListItemText>
          </Box>
        )) }
      </List>
    );
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
    signedToken: state.auth.signedToken as AccessToken
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FormEditScreen));
