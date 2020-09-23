import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-screen";

import { History } from "history";
import { WithStyles, withStyles, CircularProgress } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken, Dictionary } from '../../types';
import Api from "../../api/api";
import { Metaform, Reply } from "../../generated/client";
import Form from "../generic/form";
import { FieldValue } from "metaform-react";
import Config from "../../config";

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
  reply?: Reply,
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
  public componentWillMount = async () => {
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
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes } = this.props;
    const { metaform } = this.state;

    if (this.state.loading || this.state.saving || !metaform) {
      return (
        <div className={ classes.loader }>
          <CircularProgress size={ 50 } color="secondary"></CircularProgress>
        </div>
      );
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

      // TODO: Notfication about success
      this.setState({
        saving: false,
        reply: updatedReply,
        formValues: updatedReply.data as any
      });
    } catch (e) {
      // TODO: Handle errors!
      this.setState({
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
