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
import { MetaformTextFieldComponent } from "../generic/editable-field-components/MetaformTextFieldComponent";
import { MetaformHtmlComponent } from "../generic/editable-field-components/MetaformHtmlFieldComponent";
import { MetaformRadioFieldComponent } from "../generic/editable-field-components/MetaformRadioFieldComponent";
import { MetaformSubmitFieldComponent } from "../generic/editable-field-components/MetaformSubmitFieldComponent";
import { MetaformNumberFieldComponent } from "../generic/editable-field-components/MetaformNumberFieldComponent";
import produce from "immer";

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
        metaformId: metaform.id
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
    const { classes } = this.props;
    const { metaform } = this.state;

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
    const { metaform } = this.state;
    const { classes } = this.props;
    
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
   * Event handler for main header change
   * 
   * @param event new main header value
   */
  private handleInputTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { metaform } = this.state;
    metaform.title = event.target.value;
    this.setState({
      metaform : metaform
    });
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
    const { classes } = this.props;
    const { metaform } = this.state;

    switch (field.type) {
      case MetaformFieldType.Text:
        return (
          <MetaformTextFieldComponent
            field={ field }
          />
        );
      case MetaformFieldType.Html:
        return (
          <MetaformHtmlComponent
            fieldLabelId={ this.getFieldLabelId(field) }
            fieldId={ this.getFieldId(field) }
            field={ field }
            metaform={ metaform }
            classes={ classes }
            fieldName={ field.name }
            onMetaformUpdate={ this.onMetaformUpdate }
          />
        );
      case MetaformFieldType.Radio:
        return (
          <MetaformRadioFieldComponent
            fieldLabelId={ this.getFieldLabelId(field) }
            fieldId={ this.getFieldId(field) }
            field={ field }
            value="test"
          />
        );
      case MetaformFieldType.Submit:
        return (
          <MetaformSubmitFieldComponent
            fieldId={ this.getFieldId(field) }
            field={ field }
            metaform={ metaform }
            onMetaformUpdate={ this.onMetaformUpdate }
          />
        );
      case MetaformFieldType.Number:
        return (
          <MetaformNumberFieldComponent
            fieldLabelId={ this.getFieldLabelId(field) }
            fieldId={ this.getFieldId(field) }
            field={ field }
            metaform={ metaform }
            classes={ classes }
            onValueUpdate={ this.onNumberValueUpdate(sectionIndex, fieldIndex) }
          />
        );
      default:
        return (
          <div style={{ color: "red" }}> 
            { strings.formEditScreen.unknownFieldType }: { field.type } 
          </div>
        );
    }
  }

  /**
   * Event handler for min/max number change
   * 
   * @param sectionIndex  section index
   * @param fieldIndex field index
   *
   * @returns updated Metaform state
   */
  private onNumberValueUpdate = (sectionIndex: number, fieldIndex: number) => (key: string, value: number) => {
    this.setState(
      produce((draft: State) => {
        const { metaform } = draft;

        if (!metaform.sections) {
          return;
        }
    
        const section = metaform.sections[sectionIndex];
    
        if (!section.fields) {
          return;
        }
    
        const field = section.fields[fieldIndex];

        if (key === "min") {
          field.min = value;
        }

        if (key === "max") {
          field.max = value;
        }
      })
    );
  }

  /**
   * Updates Metaform data to state
   * 
   * @param updatedMetaform updated Metaform
   */
  private onMetaformUpdate = (updatedMetaform: Metaform) => {
    this.setState({
      metaform: updatedMetaform
    });
  } 

  /**
  * Returns field"s id
  * 
  * @param field metaform field
  */
  private getFieldId = (field : MetaformField) => {
    const { metaformId } = this.state;

    return `${ metaformId }-field-${ field.name }`;
  }

  /**
  * Returns field label"s id
  * 
  * @param field metaform field
  */
  private getFieldLabelId = (field : MetaformField) => {
    return `${this.getFieldId(field)}-label`;
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
