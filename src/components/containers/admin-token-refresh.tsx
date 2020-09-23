import * as React from "react";

import { connect } from "react-redux";
import { ReduxState, ReduxActions } from "../../store";
import { adminLogin } from "../../actions/auth";

import { AccessToken } from "../../types";
import ErrorDialog from "../generic/error-dialog";
import { KeycloakInstance } from "keycloak-js";
import Keycloak from "keycloak-js";
import Config from "../../config";

/**
 * Component props
 */
interface Props {
  adminToken?: AccessToken;
  onAdminLogin: (keycloak: KeycloakInstance, adminToken: AccessToken) => void;
}

/**
 * Component state
 */
interface State {
  error?: Error;
}

/**
 * Component for keeping authentication token fresh
 */
class AccessTokenRefresh extends React.Component<Props, State> {

  private keycloak: KeycloakInstance;
  private timer?: any;

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.keycloak = Keycloak(Config.getAdminLoginConfig());
    this.state = { };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const auth = await this.keycloakInit();

    if (!auth) {
      window.location.reload();
    } else {
      if (this.keycloak) {
        await this.keycloak.loadUserProfile();

        const adminToken = this.buildToken(this.keycloak);
        if (adminToken) {
          this.props.onAdminLogin(this.keycloak, adminToken);
        }
      }

      this.refreshAccessToken();

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
    if (this.state.error) {
      return <ErrorDialog error={ this.state.error } onClose={ () => this.setState({ error: undefined }) } />;
    }

    return this.props.adminToken ? this.props.children : null;
  }

  /**
   * Refreshes access token
   */
  private refreshAccessToken() {
    try {
      const refreshed = this.keycloak.updateToken(70);
      if (refreshed) {
        const adminToken = this.buildToken(this.keycloak);
        if (adminToken) {
          this.props.onAdminLogin(this.keycloak, adminToken);
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
  private keycloakInit = () => {
    return new Promise(resolve => {
      this.keycloak.init({ onLoad: "login-required", checkLoginIframe: false }).success(resolve);
    });
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
      userId: tokenParsed.sub
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
    adminToken: state.auth.adminToken
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: React.Dispatch<ReduxActions>) {
  return {
    onAdminLogin: (keycloak: KeycloakInstance, adminToken: AccessToken) => dispatch(adminLogin(keycloak, adminToken))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccessTokenRefresh) as any;