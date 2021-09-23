import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/preview-screen";
import { History } from "history";
import { Box, WithStyles, withStyles } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
import { AccessToken, Dictionary, EditorNavigationLinks, FieldValue } from "../../types";
import Api from "../../api/api";
import { Metaform } from "../../generated/client";
import Config from "../../config";
import AdminLayoutV2 from "../layouts/admin-layout-v2";
import { setMetaform } from "../../actions/metaform";
import { ValidationErrors } from "metaform-react/dist/types";
import Form from "../generic/form";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  signedToken: AccessToken;
  metaform?: Metaform;
  contexts?: string[];
  onSetMetaform: (metaform?: Metaform) => void;
}

/**
 * Component state
 */
interface State {
  error?: string | Error | Response;
  isLoading: boolean;
  formValid: boolean;
  formValues: Dictionary<FieldValue>;
}

/**
 * Component for Metaform preview
 */
export class PreviewScreen extends React.Component<Props, State> {
  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      formValid: true,
      formValues: {}
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const {
      metaform,
      signedToken, 
      onSetMetaform,
    } = this.props;

    if (metaform) {
      return;
    }

    try {
      this.setState({
        isLoading: true
      });

      const metaformsApi = Api.getMetaformsApi(signedToken);

      // Load test metaform
      const loadedMetaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });

      onSetMetaform(loadedMetaform);

      this.setState({
        isLoading: false
      });
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
    const { error, isLoading } = this.state;
    const {
      classes,
      keycloak,
      metaform,
    } = this.props;

    return (
      <AdminLayoutV2
      activeNavigationLink={ EditorNavigationLinks.preview }
        keycloak={ keycloak }
        metaform={ metaform }
        loading={ isLoading || !metaform }
        error={ error }
        clearError={ this.clearError }
      >
        <Box className={ classes.root }>
          { this.renderForm() }
        </Box>
      </AdminLayoutV2>
    );
  };

  /**
   * Renders the form
   */
  private renderForm = () => {
    const {
      classes, 
      metaform, 
      signedToken 
    } = this.props;

    if (!metaform) {
      return null
    }

    return (
      <Box className={ classes.formContainer }>
        <Form
          accessToken={ signedToken }
          contexts={ ["FORM"] }    
          metaform={ metaform }
          onSubmit={() => {}}
          getFieldValue={ this.getFieldValue }
          setFieldValue={ this.setFieldValue }
          onValidationErrorsChange={ this.onValidationErrorsChange }
        />
      </Box>
    );
  }

  /**
   * Method for getting field value
   *
   * @param fieldName field name
   * 
   * @return field value
   */
  private getFieldValue = (fieldName: string): FieldValue => {
    const { formValues } = this.state;

    return formValues[fieldName];
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
        formValues: formValues,
      });
    }
  }

  /**
   * Event handler for validation errors change
   * 
   * @param validationErrors validation errors
   */
  private onValidationErrorsChange = (validationErrors: ValidationErrors) => {
    const formValid = Object.keys(validationErrors).length === 0;

    if (formValid !== this.state.formValid) {
      this.setState({
        formValid: formValid
      });
    }
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
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    onSetMetaform: (metaform?: Metaform) => dispatch(setMetaform(metaform)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PreviewScreen));
