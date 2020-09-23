import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-screen";
import AdminLayout from "../layouts/admin-layout";
import { SnackbarMessage } from "../layouts/basic-layout";

import { History } from "history";
import { WithStyles, withStyles } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken, Dictionary } from '../../types';
import Api from "../../api/api";
import { Metaform, Reply } from "../../generated/client";
import Form from "../generic/form";
import { FieldValue } from "metaform-react";
import Config from "../../config";
import strings from "../../localization/strings";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  replyId: string;
  adminToken: AccessToken;
}

/**
 * Component state
 */
interface State {
  metaform?: Metaform;
  reply?: Reply;
  snackbarMessage?: SnackbarMessage;
  error?: string | Error | Response;
  loading: boolean;
  saving: boolean;
  formValues: Dictionary<string | number | null>;
}

/**
 * Component for exhibitions screen
 */
export class AdminReplyScreen extends React.Component<Props, State> {

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

      const metaformsApi = Api.getMetaformsApi(this.props.adminToken);
      const repliesApi = Api.getRepliesApi(this.props.adminToken);

      const [ metaform, reply ] = await Promise.all([
        metaformsApi.findMetaform({
          realmId: Config.getRealm(),
          metaformId: Config.getMetaformId()
        }),
        repliesApi.findReply({
          realmId: Config.getRealm(),
          metaformId: Config.getMetaformId(),
          replyId: this.props.replyId
        })
      ]);
    
      this.setState({
        metaform: metaform,
        reply: reply,
        formValues: reply.data as any,
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
    return (
      <AdminLayout keycloak={ this.props.keycloak } loading={ this.state.loading || this.state.saving } loadMessage={ this.state.saving ? strings.adminReplyScreen.savingReply : undefined } snackbarMessage={ this.state.snackbarMessage } error={ this.state.error } clearError={ this.clearError } clearSnackbar={ this.clearSnackbar }>
        { this.renderForm(this.state.metaform) }
      </AdminLayout>
    );
  }

  private renderForm = (metaform?: Metaform) => {
    if (!metaform) {
      return null;
    }

    return (
      <Form  
        contexts={ ["MANAGEMENT"] }
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
   *
   * @param source submit input info
   */
  private onSubmit = async (source: Metaform) =>  {
    const { formValues, metaform, reply } = this.state;

    if (!metaform || !metaform.id || !reply || !reply.id) {
      return;
    }

    this.setState({
      saving: true
    });

    try {
      const repliesApi = Api.getRepliesApi(this.props.adminToken);

      await repliesApi.updateReply({
        realmId: Config.getRealm(),
        metaformId: Config.getMetaformId(),
        reply: { ... reply, data: formValues as any },
        replyId: reply.id
      });

      const updatedReply = await repliesApi.findReply({
        realmId: Config.getRealm(),
        metaformId: Config.getMetaformId(),
        replyId: reply.id
      });

      this.setState({
        saving: false,
        reply: updatedReply,
        formValues: updatedReply.data as any,
        snackbarMessage: {
          message: strings.adminReplyScreen.replySaved,
          severity: "success"
        }
      });
    } catch (e) {
      this.setState({
        error: e,
        saving: false
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
    adminToken: state.auth.adminToken as AccessToken
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AdminReplyScreen));
