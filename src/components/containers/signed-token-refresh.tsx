import * as React from "react";

import { connect } from "react-redux";
import { ReduxState, ReduxActions } from "../../store";
import { signedLogin } from "../../actions/auth";

import { AccessToken, LoginMode } from "../../types";
import ErrorDialog from "../generic/error-dialog";
import { KeycloakInstance } from "keycloak-js";
import Keycloak from "keycloak-js";
import Config from "../../config";
import ConfirmAuthRedirectDialog from "../generic/auth-redirect-dialog";
import { WithStyles } from "@material-ui/core";
import styles from "../../styles/form";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles>{
  loginMode: LoginMode;
  signedToken?: AccessToken;
  onSignedLogin: (keycloak: KeycloakInstance, signedToken: AccessToken) => void;
}

/**
 * Component state
 */
interface State {
  error?: Error | unknown;
  dialogOpen: boolean;
}

/**
 * Component for keeping authentication token fresh
 */
class SignedTokenRefresh extends React.Component<Props, State> {

  private keycloak: KeycloakInstance;
  private timer?: any;

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.keycloak = Keycloak(Config.getSignedKeycloakConfig());
    
    this.state = {
      dialogOpen: true
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const { loginMode } = this.props;

    const auth = await this.keycloakInit();

    if (!auth && this.state.dialogOpen === false) {
      await this.keycloak.login(Config.getSignedKeycloakLoginOptions(loginMode));
      window.location.reload();
    } else {
      if (this.keycloak) {
        await this.keycloak.loadUserProfile();

        const signedToken = this.buildToken(this.keycloak);
        if (signedToken) {
          this.props.onSignedLogin(this.keycloak, signedToken);
        }
      }

      await this.refreshAccessToken();

      this.timer = setInterval(() => {
        this.refreshAccessToken();
      }, 1000 * 60);
    }
  }

  /**
   * Component will unmount life cycle event
   */
  public componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * Component render method
   */
  public render() {
    const { children, signedToken, classes } = this.props;
    const { dialogOpen, error } = this.state;

    if(this.props.loginMode === "USER"){
      return <ConfirmAuthRedirectDialog classes={ classes } onConfirm={ this.onConfirm } dialogOpen={ dialogOpen } />
    }
    
    if (this.state.error) {
      return <ErrorDialog error={ error } onClose={ () => this.setState({ error: undefined }) } />;
    }

    return signedToken ? children : null;
  }

  /**
   * Update dialog state
   */
  private onConfirm = () => {
    console.log(this.state.dialogOpen)
    this.setState({dialogOpen: false})
    console.log(this.state.dialogOpen)
  }

  /**
   * Refreshes access token
   */
  private refreshAccessToken = async () => {
    try {
      const refreshed = await this.keycloak.updateToken(70);
      if (refreshed) {
        const signedToken = this.buildToken(this.keycloak);
        if (signedToken) {
          this.props.onSignedLogin(this.keycloak, signedToken);
        }
      }
    } catch (e) {
      this.setState({
        error: e
      });
    }
  }

  /**
   * Initializes Keycloak client
   */
  private keycloakInit = async () => {
    return await this.keycloak.init({
      checkLoginIframe: false
    })
  }

  /**
   * Builds an access token using Keycloak instance
   * 
   * @param keycloak Keycloak instance
   * @returns access token or undefined if building fails
   */
  private buildToken = (keycloak: KeycloakInstance): AccessToken | undefined => {
    const { token, tokenParsed, refreshToken, refreshTokenParsed, profile } = keycloak;

    if (!tokenParsed || !tokenParsed.sub || !token) {
      return undefined;
    }
    
    const created = new Date();      

    return {
      created: created,
      access_token: token,
      expires_in: tokenParsed.exp,
      refresh_token: refreshToken,
      refresh_expires_in: refreshTokenParsed?.exp,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      userId: tokenParsed.sub,
      realmRoles: tokenParsed.realm_access?.roles || []
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
    signedToken: state.auth.signedToken
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: React.Dispatch<ReduxActions>) {
  return {
    onSignedLogin: (keycloak: KeycloakInstance, signedToken: AccessToken) => dispatch(signedLogin(keycloak, signedToken))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignedTokenRefresh) as any;
