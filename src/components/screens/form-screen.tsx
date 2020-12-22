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
import { Metaform, Reply } from "../../generated/client";
import { FieldValue } from "metaform-react";
import Form from "../generic/form";
import Config from "../../config";
import strings from "../../localization/strings";
import Alert from "@material-ui/lab/Alert";
import EmailDialog from "../generic/email-dialog";
import Mail from "../../mail/mail";

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
  draftEmailDialogVisible: boolean;
  draftId: string | null;
  replySavedVisible: boolean;
  replyEmailDialogVisible: boolean;
  reply?: Reply;
  ownerKey: string | null;
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
      draftEmailDialogVisible: false,
      replySavedVisible: false,
      replyEmailDialogVisible: false,
      draftId: null,
      ownerKey: null,
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
    const replyId = query.get("reply");
    const ownerKey = query.get("owner-key");

    const metaformId = Config.getMetaformId();    

    try {
      this.setState({
        loading: true,
        draftId: draftId,
        ownerKey: ownerKey
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

      if (replyId && ownerKey) {
        const replyApi = Api.getRepliesApi(anonymousToken);
        const reply = await replyApi.findReply({
          metaformId: metaformId,
          replyId: replyId,
          ownerKey: ownerKey
        });

        const replyData = reply?.data || {};
        Object.keys(replyData).forEach(replyKey => {
          formValues[replyKey] = replyData[replyKey] as any;
        });

        this.setState({
          reply: reply
        });
      } else if (draftId) {
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
          { this.renderReplySaved() }
          { this.renderReplyEmailDialog() }
          { this.renderDraftSave() }
          { this.renderDraftSaved() }
          { this.renderDraftEmailDialog() }
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
          <Link href="#" onClick={ this.onSaveDraftLinkClick }> { strings.formScreen.saveDraftLink } </Link>
        </Alert>
      </Snackbar>
    );
  }

  /**
   * Renders draft saved dialog
   */
  private renderDraftSaved = () => {
    const { draftSavedVisible } = this.state;
    const draftLink = this.getDraftLink();

    if (!draftLink) {
      return null;
    }

    return (
      <Snackbar open={ draftSavedVisible } onClose={ this.onDraftSavedClose } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={ this.onDraftSavedClose } severity="success">
          <span> { strings.formScreen.draftSaved } </span>
          <br/><br/>
          <a href={ draftLink }> { draftLink } </a>
          <p> 
            { strings.formScreen.draftEmailText } 
            <Link href="#" onClick={ this.onDraftEmailLinkClick }> { strings.formScreen.draftEmailLink } </Link>
          </p>
        </Alert>
      </Snackbar>
    );
  }

  /**
   * Renders reply email dialog
   */
  private renderDraftEmailDialog = () => {
    return (
      <EmailDialog 
        text={ strings.formScreen.draftEmailDialogText }
        open={ this.state.draftEmailDialogVisible }
        onSend={ this.onDraftEmailDialogSend }
        onCancel={ this.onDraftEmailDialogCancel }
      />
    );
  }

  /**
   * Renders reply saved dialog
   */
  private renderReplySaved = () => {
    const replyEditLink = this.getReplyEditLink();

    if (replyEditLink) {      
      return (
        <Snackbar open={ this.state.replySavedVisible } onClose={ this.onReplySavedClose } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={ this.onReplySavedClose  } severity="success">
            <span> { strings.formScreen.replySaved } </span>
            <p> { strings.formScreen.replyEdit } </p>
            <div style={{ textOverflow: "ellipsis", overflow: "hidden", maxWidth: "50vw", whiteSpace: "nowrap" }}>
              <a href={ replyEditLink }> { replyEditLink } </a>
            </div>
            <p> 
              { strings.formScreen.replyEditEmailText } 
              <Link href="#" onClick={ this.onReplyEmailLinkClick }> { strings.formScreen.replyEditEmailLink } </Link>
            </p>
          </Alert>
        </Snackbar>
      );
    } else {
      return (
        <Snackbar open={ this.state.replySavedVisible } onClose={ this.onReplySavedClose } anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={ this.onReplySavedClose  } severity="success">
            <span> { strings.formScreen.replySaved } </span>
          </Alert>
        </Snackbar>
      );
    }
  }

  /**
   * Renders reply email dialog
   */
  private renderReplyEmailDialog = () => {
    return (
      <EmailDialog 
        text={ strings.formScreen.replyEditEmailDialogText }
        open={ this.state.replyEmailDialogVisible }
        onSend={ this.onReplyEmailDialogSend }
        onCancel={ this.onReplyEmailDialogCancel }
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
   * Sends draft link to given email
   * 
   * @param email email
   */
  private sendDraftEmail = async (email: string) => {
    const { metaform } = this.state;
    const { REACT_APP_EMAIL_FROM } = process.env;
    const draftLink = this.getDraftLink();
    
    if (!draftLink || !metaform) {
      return;
    }

    try {
      this.setState({
        draftEmailDialogVisible: false,
        loading: true
      });

      if (!REACT_APP_EMAIL_FROM) {
        throw new Error("Missing REACT_APP_EMAIL_FROM env");
      }

      const formTitle = metaform.title || "";
      const subject = strings.formatString(strings.formScreen.draftEmailSubject, formTitle) as string;
      const html = strings.formatString(strings.formScreen.draftEmailContent, formTitle, draftLink) as string;

      await Mail.sendMail({
        from: REACT_APP_EMAIL_FROM,
        html: html,
        subject: subject,
        to: email
      });

      this.setState({
        loading: false,
        snackbarMessage: {
          message: strings.formScreen.draftEmailSent,
          severity: "success"
        }
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  }

  /**
   * Sends reply link to given email
   * 
   * @param email email
   */
  private sendReplyEmail = async (email: string) => {
    const { metaform } = this.state;
    const { REACT_APP_EMAIL_FROM } = process.env;
    const replyEditLink = this.getReplyEditLink();
    
    if (!replyEditLink || !metaform) {
      return;
    }

    try {
      this.setState({
        replyEmailDialogVisible: false,
        loading: true
      });

      if (!REACT_APP_EMAIL_FROM) {
        throw new Error("Missing REACT_APP_EMAIL_FROM env");
      }

      const formTitle = metaform.title || "";
      const subject = strings.formatString(strings.formScreen.replyEditEmailSubject, formTitle) as string;
      const html = strings.formatString(strings.formScreen.replyEditEmailContent, formTitle, replyEditLink) as string;

      await Mail.sendMail({
        from: REACT_APP_EMAIL_FROM,
        html: html,
        subject: subject,
        to: email
      });

      this.setState({
        loading: false,
        snackbarMessage: {
          message: strings.formScreen.replyEditEmailSent,
          severity: "success"
        }
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  }

  /**
   * Returns draft link
   * 
   * @returns draft link or null if not available
   */
  private getDraftLink = () => {
    const { draftId } = this.state;
    if (!draftId) {
      return null;
    }

    const { location } = window;
    return (new URL(`${location.protocol}//${location.hostname}:${location.port}${location.pathname}?draft=${draftId}`)).toString();
  }

  /**
   * Returns reply edit link
   * 
   * @returns reply edit link or null if not available
   */
  private getReplyEditLink = () => {
    const { reply, ownerKey } = this.state;
    if (!reply || !ownerKey) {
      return null;
    }

    const { location } = window;
    return (new URL(`${location.protocol}//${location.hostname}:${location.port}${location.pathname}?reply=${reply.id}&owner-key=${ownerKey}`)).toString();
  }

  /**
   * Method for submitting form
   */
  private onSubmit = async () =>  {
    const { formValues, metaform, ownerKey } = this.state;
    let { reply } = this.state;

    if (!metaform || !metaform.id) {
      return;
    }

    this.setState({
      saving: true
    });

    try {
      const repliesApi = Api.getRepliesApi(this.props.anonymousToken);

      if (reply && reply.id && ownerKey) {
        await repliesApi.updateReply({
          metaformId: Config.getMetaformId(),
          replyId: reply.id,
          ownerKey: ownerKey,
          reply: {
            data: formValues as any
          }
        });
      } else {
        reply = await repliesApi.createReply({
          metaformId: Config.getMetaformId(),
          reply: {
            data: formValues as any
          },
          replyMode: Config.getReplyMode()
        });
      }
  
      this.setState({
        saving: false,
        replySavedVisible: true,
        reply: reply,
        ownerKey: ownerKey || reply.ownerKey || null
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

  /**
   * Event handler for draft email link click
   */
  private onDraftEmailLinkClick = () => {
    this.setState({
      draftSavedVisible: false,
      draftEmailDialogVisible: true
    });
  }

  /**
   * Event handler for draft email dialog send click
   * 
   * @param email email
   */
  private onDraftEmailDialogSend = (email: string) => {
    this.sendDraftEmail(email);
  }

  /**
   * Event handler for draft email dialog cancel click
   * 
   * @param email email
   */
  private onDraftEmailDialogCancel = () => {
    this.setState({
      draftEmailDialogVisible: false
    });
  }

  /**
   * Event handler for reply email link click
   */
  private onReplyEmailLinkClick = () => {
    this.setState({
      replySavedVisible: false,
      replyEmailDialogVisible: true
    });
  }

  /**
   * Event handler for reply email dialog send click
   * 
   * @param email email
   */
  private onReplyEmailDialogSend = (email: string) => {
    this.sendReplyEmail(email);
  }

  /**
   * Event handler for reply email dialog cancel click
   * 
   * @param email email
   */
  private onReplyEmailDialogCancel = () => {
    this.setState({
      replyEmailDialogVisible: false
    });
  }

  /**
   * Event handler for reply saved snackbar close
   */
  private onReplySavedClose  = () => {
    this.setState({
      replySavedVisible: false
    });
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
