import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-screen";

import { History, Location } from "history";
import { Link, Snackbar, WithStyles, withStyles } from "@material-ui/core";
import BasicLayout, { SnackbarMessage } from "../layouts/basic-layout";

import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken, Dictionary } from '../../types';
import Api from "../../api/api";
import { Metaform } from "../../generated/client";
import { FieldValue } from "metaform-react";
import Form from "../generic/form";
import Config from "../../config";
import strings from "../../localization/strings";
import Alert from "@material-ui/lab/Alert";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  location: Location;
  keycloak: KeycloakInstance;
  anonymousToken: AccessToken;
}

/**
 * Component state
 */
interface State {
  snackbarMessage?: SnackbarMessage;
  error?: string | Error | Response;
  loading: boolean;
  saving: boolean;
  draftSavedVisible: boolean;
  draftSaveVisible: boolean;
  draftId: string | null;
  metaform?: Metaform;
  formValues: Dictionary<FieldValue>;  
}

/**
 * Component for exhibitions screen
 */
export class FormScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {      
      loading: false,
      saving: false,
      draftSaveVisible: false,
      draftSavedVisible: false,
      draftId: null,
      formValues: {}
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const { location, anonymousToken } = this.props;
    const query = new URLSearchParams(location.search);

    const draftId = query.get("draft");
    const metaformId = Config.getMetaformId();

    try {
      this.setState({
        loading: true,
        draftId: draftId
      });

      const metaformsApi = Api.getMetaformsApi(anonymousToken);

      const metaform = await metaformsApi.findMetaform({
        metaformId: metaformId
      });
      
      const formValues = { ...this.state.formValues };
      document.title = metaform.title ? metaform.title : "Metaform";

      metaform.sections?.forEach(section => {        
        section.fields?.forEach(field => {
          const { name, _default, options } = field;

          if (name) {
            if (_default) {
              formValues[name] = _default;
            } else if (options && options.length) {
              const selectedOption = options.find(option => option.selected || option.checked);
              if (selectedOption) {
                formValues[name] = selectedOption.name;
              }
            }
          }
        });
      });

      if (draftId) {
        const draftApi = Api.getDraftsApi(anonymousToken);
        const draft = await draftApi.findDraft({
          metaformId: metaformId,
          draftId: draftId
        });

        const draftData = draft?.data || {};
        Object.keys(draftData).forEach(draftKey => {
          formValues[draftKey] = draftData[draftKey] as any;
        });
      }

      this.setState({
        metaform: metaform,
        formValues: formValues,
        loading: false
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes } = this.props;

    return (
      <BasicLayout loading={ this.state.loading || this.state.saving } loadMessage={ this.state.saving ? strings.formScreen.savingReply : undefined } snackbarMessage={ this.state.snackbarMessage } error={ this.state.error } clearError={ this.clearError } clearSnackbar={ this.clearSnackbar }>
        <div className={ classes.root }>
          { this.renderForm() }
          { this.renderDraftSave() }
          { this.renderDraftSaved() }
        </div>
      </BasicLayout>
    );
  }

  /**
   * Renders the form
   */
  private renderForm = () => {
    const { metaform } = this.state;

    if (!metaform) {
      return null
    }

    return (
      <Form  
        contexts={ ["FORM"] }    
        metaform={ metaform }
        getFieldValue={ this.getFieldValue }
        setFieldValue={ this.setFieldValue }
        onSubmit={ this.onSubmit }
      />
    );
  }

  /**
   * Renders draft save dialog
   */
  private renderDraftSave = () => {
    const { draftSaveVisible } = this.state;

    return (
      <Snackbar open={ draftSaveVisible }  onClose={ this.onDraftSaveClose }>
        <Alert onClose={ this.onDraftSaveClose } severity="info">
          <span> { strings.formScreen.saveDraft } </span>
          <Link onClick={ this.onSaveDraftLinkClick }> { strings.formScreen.saveDraftLink } </Link>
        </Alert>
      </Snackbar>
    );
  }

  /**
   * Renders draft saved dialog
   */
  private renderDraftSaved = () => {
    const { draftSavedVisible, draftId } = this.state;
    if (!draftId) {
      return null;
    }

    const { location } = window;
    const href = (new URL(`${location.protocol}//${location.hostname}:${location.port}${location.pathname}?draft=${draftId}`)).toString();

    return (
      <Snackbar open={ draftSavedVisible } onClose={ this.onDraftSavedClose } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={ this.onDraftSavedClose } severity="success">
          <span> { strings.formScreen.draftSaved } </span>
          <br/><br/>
          <a href={ href }> { href } </a>
        </Alert>
      </Snackbar>
    );
  }

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   */
  private getFieldValue = (fieldName: string): FieldValue => {
    return this.state.formValues[fieldName];
  }

  /**
   * Method for setting field value
   *
   * @param fieldName field name
   * @param fieldValue field value
   */
  private setFieldValue = (fieldName: string, fieldValue: FieldValue) => {
    const { formValues } = this.state;

    if (formValues[fieldName] !== fieldValue) {
      formValues[fieldName] = fieldValue;
      this.setState({
        formValues: formValues
      });
      this.setState({
        draftSaveVisible: !!this.state.metaform?.allowDrafts
      });
    }
  }

  /**
   * Clears error
   */
  private clearError = () => {
    this.setState({ 
      error: undefined 
    });
  }

  /**
   * Clears snackbar message
   */
  private clearSnackbar = () => {
    this.setState({ 
      snackbarMessage: undefined 
    });
  }

  /**
   * Save the reply as draft
   */
  private saveDraft = async () => {
    try {
      const { metaform, formValues, draftId } = this.state;
      if (!metaform || !metaform.id) {
        return;
      }

      this.setState({
        loading: true,
        draftSaveVisible: false
      });

      const draftsApi = Api.getDraftsApi(this.props.anonymousToken);
      let draft;

      if (draftId) {
        draft = await draftsApi.updateDraft({
          metaformId: metaform.id,
          draftId: draftId,
          draft: {          
            data: formValues as any
          }
        }) 
      } else {
        draft = await draftsApi.createDraft({
          metaformId: metaform.id,
          draft: {          
            data: formValues as any
          }
        }) 
      }

      this.setState({
        draftId: draft.id!,
        draftSavedVisible: true,
        loading: false
      });

    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  }

  /**
   * Method for submitting form
   */
  private onSubmit = async () =>  {
    const { formValues, metaform } = this.state;

    if (!metaform || !metaform.id) {
      return;
    }

    this.setState({
      saving: true
    });

    try {
      const repliesApi = Api.getRepliesApi(this.props.anonymousToken);

      await repliesApi.createReply({
        metaformId: Config.getMetaformId(),
        reply: {
          data: formValues as any
        },
        replyMode: Config.getReplyMode()
      });

      this.setState({
        saving: false,
        snackbarMessage: {
          message: strings.formScreen.replySaved,
          severity: "success"
        }
      });
    } catch (e) {
      this.setState({
        saving: false,
        error: e
      });
    };

  }

  /**
   * Event handler for draft save snackbar close
   */
  private onDraftSaveClose = () => {
    this.setState({
      draftSaveVisible: false
    });
  }

  /**
   * Event handler for draft save snackbar close
   */
  private onDraftSavedClose = () => {
    this.setState({
      draftSavedVisible: false
    });
  }

  /**
   * Event handler for draft save link click
   */
  private onSaveDraftLinkClick = () => {
    this.saveDraft();
  }

}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 */
function mapStateToProps(state: ReduxState) {
  return {
    keycloak: state.auth.keycloak as KeycloakInstance,
    anonymousToken: state.auth.anonymousToken as AccessToken
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FormScreen));
