import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-screen";

import { History } from "history";
import { WithStyles, withStyles } from "@material-ui/core";
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

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
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
  metaform?: Metaform;
  formValues: Dictionary<string | number | null>;
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
      formValues: {}
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    try {
      this.setState({
        loading: true
      });

      const metaformsApi = Api.getMetaformsApi(this.props.anonymousToken);

      const metaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });
      
      document.title = metaform.title ? metaform.title : "Metaform";

      this.setState({
        metaform: metaform,
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
    formValues[fieldName] = fieldValue;
    this.setState({
      formValues: formValues
    });
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
