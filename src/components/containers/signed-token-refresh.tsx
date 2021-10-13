import * as React from "react";

import { connect } from "react-redux";
import { ReduxState, ReduxActions } from "../../store";
import { signedLogin } from "../../actions/auth";

import { AccessToken, LoginMode, SignedToken } from "../../types";
import ErrorDialog from "../generic/error-dialog";
import { KeycloakInstance } from "keycloak-js";
import Keycloak from "keycloak-js";
import Config from "../../config";
import ConfirmAuthRedirectDialog from "../generic/auth-redirect-dialog";
import { withStyles, WithStyles } from "@material-ui/core";
import styles from "../../styles/form";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  loginMode: LoginMode;
  signedToken?: SignedToken;
  onSignedLogin: (keycloak: KeycloakInstance, signedToken: SignedToken) => void;
  children: React.ReactNode;
}

/**
 * Component state
 */
interface State {
  error?: Error | unknown;
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
    this.state = {};
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const { onSignedLogin } = this.props;

    try {
      const auth = await this.keycloakInit();

      if (!auth) {
        onSignedLogin(this.keycloak, null);
        return;
      }

      await this.keycloak.loadUserProfile();

      const signedToken = await this.buildToken(this.keycloak);
      this.props.onSignedLogin(this.keycloak, signedToken);

      await this.refreshAccessToken();

      this.timer = setInterval(this.refreshAccessToken, 1000 * 60);
    } catch (error) {
      this.setState({ error: error });
    }
  }

  /**
   * Component will unmount life cycle event
   */
  public componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  /**
   * Component render method
   */
  public render() {
    const { children, signedToken, classes, loginMode } = this.props;
    const { error } = this.state;

    if (loginMode === "USER" && signedToken === null) {
      return (
        <ConfirmAuthRedirectDialog
          classes={ classes }
          onConfirm={ () => this.keycloak.login(Config.getSignedKeycloakLoginOptions(loginMode)) }
          dialogOpen
        />
      );
    }
    
    if (error) {
      return (
        <ErrorDialog
          error={ error }
          onClose={ () => this.setState({ error: undefined }) }
        />
      );
    }

    return signedToken ? children : null;
  }

  /**
   * Refreshes access token
   */
  private refreshAccessToken = async () => {
    try {
      const refreshed = await this.keycloak.updateToken(70);
      if (refreshed) {
        try {
          const signedToken = await this.buildToken(this.keycloak);
          this.props.onSignedLogin(this.keycloak, signedToken);
        } catch (error) {
          this.setState({ error: error });
        }
      }
    } catch (error) {
      this.setState({ error: error });
    }
  }

  /**
   * Initializes Keycloak client
   */
  private keycloakInit = async () => {
    const { loginMode } = this.props;

    return await this.keycloak.init({
      checkLoginIframe: false,
      onLoad: loginMode === "ADMIN" ? "login-required" : "check-sso"
    })
  }

  /**
   * Builds an access token using Keycloak instance
   * 
   * @param keycloak Keycloak instance
   * @returns access token or undefined if building fails
   */
  private buildToken = async (keycloak: KeycloakInstance): Promise<AccessToken> => {
    const {
      token,
      tokenParsed,
      refreshToken,
      refreshTokenParsed,
      profile
    } = keycloak;

    if (!tokenParsed || !tokenParsed.sub || !token) {
      return Promise.reject("No token to parse");
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
const mapStateToProps = (state: ReduxState) => ({
  signedToken: state.auth.signedToken
});

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
const mapDispatchToProps = (dispatch: React.Dispatch<ReduxActions>) => ({
    onSignedLogin: (keycloak: KeycloakInstance, signedToken: SignedToken) => dispatch(signedLogin(keycloak, signedToken))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignedTokenRefresh));