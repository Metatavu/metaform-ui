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
import { Metaform } from "../../generated/client";
import { FieldValue } from "metaform-react";
import Form from "../generic/form";
import Config from "../../config";

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
  public componentWillMount = async () => {
    this.setState({
      loading: true
    });

    const metaformsApi = Api.getMetaformsApi(this.props.anonymousToken);

    const metaform = await metaformsApi.findMetaform({
      realmId: Config.getRealm(),
      metaformId: Config.getMetaformId()
    });
    
    this.setState({
      metaform: metaform,
      loading: false
    });    
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes, history, keycloak } = this.props;
    const { metaform } = this.state;

    if (this.state.loading || this.state.saving || !metaform) {
      return (
        <div className={ classes.loader }>
          <CircularProgress size={ 50 } color="secondary"></CircularProgress>
        </div>
      );
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
   * Method for submitting form
   *
   * @param source submit input info
   */
  private onSubmit = async (source: Metaform) =>  {
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
        realmId: Config.getRealm(),
        metaformId: Config.getMetaformId(),
        reply: {
          data: formValues as any
        }
      });

      // TODO: Notfication about success
      this.setState({
        saving: false
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
