import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/admin-invite-screen";
import AdminLayout from "../layouts/admin-layout";
import { SnackbarMessage } from "../layouts/basic-layout";

import { History } from "history";
import { WithStyles, withStyles, Typography } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken, Dictionary } from '../../types';
import Api from "../../api/api";
import { Metaform } from "../../generated/client";
import Config from "../../config";
import strings from "../../localization/strings";
import Form from "../generic/form";
import { FieldValue } from "metaform-react";
import Utils from "../../utils";
import Mail from "../../mail/mail";

const { REACT_APP_EMAIL_FROM } = process.env;

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  adminToken: AccessToken;
}

/**
 * Component state
 */
interface State {
  metaform?: Metaform;
  snackbarMessage?: SnackbarMessage;
  error?: string | Error | Response;
  loading: boolean;
  sending: boolean;
  formValues: Dictionary<FieldValue>;
  emailField?: string;
}

/**
 * Component for exhibitions screen
 */
export class AdminInviteScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {      
      loading: false,
      sending: false,
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

      const metaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });

      const emailField = this.getEmailField(metaform);

      if (!emailField) {
        this.setState({
          snackbarMessage: {
            message: strings.adminInviteScreen.emailFieldNotFoundError,
            severity: "error"
          }
        });
      }

      this.setState({
        metaform: metaform,
        loading: false,
        emailField: emailField?.name
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
    const { classes, keycloak } = this.props;
    const { metaform, loading, sending, snackbarMessage, error } = this.state;

    return (
      <AdminLayout 
        keycloak={ keycloak } 
        metaform={ metaform }
        loading={ loading || sending } 
        loadMessage={ sending ? strings.adminInviteScreen.sendingInvitation : undefined } 
        snackbarMessage={ snackbarMessage } 
        error={ error } 
        clearError={ this.clearError } 
        clearSnackbar={ this.clearSnackbar }
      >
        <div className={ classes.topBar }>
          <Typography className={ classes.title } variant="h2">
            { strings.adminInviteScreen.title }
          </Typography>
        </div>
        
        <div className={ classes.formContainer }>
          { this.renderForm() }
        </div>
      </AdminLayout>
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
        accessToken={ this.props.adminToken }
        contexts={ ["INVITE"] }    
        metaform={ metaform }
        getFieldValue={ this.getFieldValue }
        setFieldValue={ this.setFieldValue }
        onSubmit={ this.onSubmit }
      />
    );
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
   * Finds email invitation field from the form.
   * 
   * Field must have INVITE in contexts, field must be required, 
   * it has to have a name and it has to be typed as email
   * 
   * @param metaform metaform
   * @return email invitation field or null if not found
   */
  private getEmailField = (metaform: Metaform) => {
    return (metaform.sections || [])
      .flatMap(section => section.fields || [])
      .filter(field => (field.contexts || []).includes("INVITE"))
      .find(field => field.type === "email" && field.name && field.required)
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
    }
  }

  /**
   * Method for submitting form
   */
  private onSubmit = async () =>  {
    const { adminToken } = this.props;
    const { formValues, metaform, emailField } = this.state;
    if (!metaform || !metaform.id || !emailField) {
      return;
    }


    const email = formValues[emailField];
    if (!email) {
      return;
    }

    if (!REACT_APP_EMAIL_FROM) {
      throw new Error("Missing REACT_APP_EMAIL_FROM env");
    }

    this.setState({
      sending: true
    });

    try {
      const repliesApi = Api.getRepliesApi(adminToken);
      const reply = await repliesApi.createReply({
        metaformId: Config.getMetaformId(),
        reply: {
          data: formValues as any
        },
        replyMode: Config.getReplyMode()
      });

      const ownerKey = reply.ownerKey;
      if (!ownerKey) {
        this.setState({
          sending: false,
          snackbarMessage: {
            message: strings.adminInviteScreen.noOwnerKeyError,
            severity: "error"
          }
        });

        return;
      }

      const inviteLink = Utils.createOwnerKeyLink(reply.id!, ownerKey);
      const formTitle = metaform.title || "";
      const subject = strings.formatString(strings.adminInviteScreen.invitationEmailSubject, formTitle) as string;
      const html = strings.formatString(strings.adminInviteScreen.invitationEmailContent, formTitle, inviteLink) as string;

      await Mail.sendMail({
        from: REACT_APP_EMAIL_FROM,
        html: html,
        subject: subject,
        to: email as string
      });

      this.setState({
        sending: false
      });
    } catch (e) {
      this.setState({
        sending: false,
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AdminInviteScreen));
