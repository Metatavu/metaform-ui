import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/admin-reply-screen";
import AdminLayout from "../layouts/admin-layout";
import { SnackbarMessage } from "../layouts/basic-layout";

import { History } from "history";
import { WithStyles, withStyles, Typography, Button } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken, Dictionary } from '../../types';
import Api from "../../api/api";
import { Metaform, MetaformFieldType, Reply } from "../../generated/client";
import Form from "../generic/form";
import { FieldValue } from "metaform-react";
import Config from "../../config";
import strings from "../../localization/strings";
import Utils from "../../utils";
import { FileFieldValue } from "metaform-react/dist/types";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  replyId: string;
  signedToken: AccessToken;
}

/**
 * Component state
 */
interface State {
  metaform?: Metaform;
  reply?: Reply;
  snackbarMessage?: SnackbarMessage;
  error?: string | Error | Response | unknown;
  loading: boolean;
  saving: boolean;
  formValues: Dictionary<FieldValue>;
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
    const { signedToken, replyId } = this.props;

    try {
      this.setState({
        loading: true
      });

      const metaformsApi = Api.getMetaformsApi(signedToken);
      const repliesApi = Api.getRepliesApi(signedToken);

      const [ metaform, reply ] = await Promise.all([
        metaformsApi.findMetaform({
          metaformId: Config.getMetaformId()
        }),
        repliesApi.findReply({
          metaformId: Config.getMetaformId(),
          replyId: replyId
        })
      ]);

      metaform.sections?.forEach(section => {        
        section.fields?.forEach(field => {
          if (field.type === MetaformFieldType.Files && !field.uploadUrl) {
            field.uploadUrl = Api.createDefaultUploadUrl()
          }
        });
      });

      let values = await this.processReplyData(metaform, reply);
      this.setState({
        metaform: metaform,
        reply: reply,
        formValues: values as any,
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
    const { classes, keycloak } = this.props;
    const { loading, saving, snackbarMessage, error, metaform } = this.state;

    return (
      <AdminLayout 
        keycloak={ keycloak } 
        metaform={ metaform }
        loading={ loading || saving } 
        loadMessage={ saving ? strings.adminReplyScreen.savingReply : undefined } 
        snackbarMessage={ snackbarMessage } 
        error={ error } 
        clearError={ this.clearError } 
        clearSnackbar={ this.clearSnackbar }
      >
        <div className={ classes.topBar }>
          <Typography className={ classes.title } variant="h2">{ strings.adminReplyScreen.title }</Typography>
          <div className={ classes.topBarButton }>
            <Button color="primary" variant="contained" className={ classes.topBarButton } onClick={ this.onExportPdfClick }>{ strings.adminReplyScreen.exportPdf }</Button>
          </div>
        </div>
        <div className={ classes.formContainer }>
          { this.renderForm(metaform) }
        </div>
      </AdminLayout>
    );
  }

  /**
   * Processes reply from server into form that is understood by ui
   * 
   * @param metaform metaform that is being viewed
   * @param reply reply loaded from server
   * @return data processes to be used by ui
   */
  private processReplyData = async (metaform: Metaform, reply: Reply) => {
    const attachmentsApi = Api.getAttachmentsApi(this.props.signedToken);
    let values = reply.data;
    for (let i = 0; i < (metaform.sections || []).length; i++) {
      let section = metaform.sections && metaform.sections[i] ? metaform.sections[i] : undefined;
      if (section) {
        for (let j = 0; j < (section.fields || []).length; j++) {
          let field = section.fields && section.fields[j] ? section.fields[j] : undefined;
          if (field &&
              field.type === MetaformFieldType.Files &&
              values &&
              field.name &&
              values[field.name]) {
            let fileIds = Array.isArray(values[field.name]) ? values[field.name] : [values[field.name]]; 
            let attachmentPromises = (fileIds as string[]).map((fileId) => {
              return attachmentsApi.findAttachment({attachmentId: fileId})
            });
            let attachments = await Promise.all(attachmentPromises);
            values[field.name] = {
              files: attachments.map(attachment => {
                return {
                  name: attachment.name,
                  id: attachment.id,
                  persisted: true
                }
              })
            };
          }
        }
      }
    }
    return values;
  }

  private renderForm = (metaform?: Metaform) => {
    if (!metaform) {
      return null;
    }

    return (
      <Form
        accessToken={this.props.signedToken}
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
   * Event handler for PDF export button click
   */
  private onExportPdfClick = async () => {
    try {
      this.setState({
        loading: true
      });

      const repliesApi = Api.getRepliesApi(this.props.signedToken);

      const pdf = await repliesApi.replyExport({
        metaformId: Config.getMetaformId(),
        replyId: this.props.replyId,
        format: "PDF"
      });


      Utils.downloadBlob(pdf, "reply.pdf");

      this.setState({
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

    let values = {...formValues};

    metaform.sections?.forEach((section) => {
      section.fields?.forEach((field) => {
        if (field.type === MetaformFieldType.Files) {
          let value = this.getFieldValue(field.name as string);
          if ( !value ) {
            value = { files: [] }
          }
          values[field.name as string] = (value as FileFieldValue).files.map(file => file.id);
        } 
      })
    });

    try {
      const repliesApi = Api.getRepliesApi(this.props.signedToken);

      await repliesApi.updateReply({
        metaformId: Config.getMetaformId(),
        reply: { ...reply, data: values as any },
        replyId: reply.id
      });

      const updatedReply = await repliesApi.findReply({
        metaformId: Config.getMetaformId(),
        replyId: reply.id
      });
      let updatedValues = await this.processReplyData(metaform, updatedReply);
      this.setState({
        saving: false,
        reply: updatedReply,
        formValues: updatedValues as any,
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AdminReplyScreen));
