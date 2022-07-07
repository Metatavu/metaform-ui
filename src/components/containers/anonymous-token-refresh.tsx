import * as React from "react";
import * as querystring from "query-string";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { connect } from "react-redux";
import { ReduxState, ReduxActions } from "../../store";
import { anonymousLogin } from "../../actions/auth";
import { AccessToken } from "../../types";
import ErrorDialog from "../generic/error-dialog";
import Config from "../../config";

const REFRESH_INTERVAL_SECONDS = 5;

/**
 * Component props
 */
interface Props {
  anonymousToken?: AccessToken | undefined;
  onAnonymousLogin: (anonymousToken: AccessToken) => void;
}

/**
 * Component state
 */
interface State {
  error?: Error;
}

/**
 * Interface representing a decoded access token
 */
interface DecodedAccessToken {
  sub: string | undefined;
  given_name: string | undefined;
  family_name: string | undefined;
  realm_access?: {
    roles: string[];
  }
}

/**
 * Component for keeping authentication token fresh
 */
class AnonymousTokenRefresh extends React.Component<Props, State> {

  private timer?: any;

  /**
   * Constructor
   *
   * @param props props
   */
  constructor(props: Props) {
    super(props);
    this.state = { };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    this.timer = setInterval(async () => {
      this.refreshLogin();
    }, REFRESH_INTERVAL_SECONDS * 1000);

    this.refreshLogin();
  }

  private refreshLogin = async () => {
    try {
      if (!this.props.anonymousToken) {
        const accessToken = await this.login();
  
        if (accessToken) {
          this.props.onAnonymousLogin(accessToken);
        }
  
        return;
      }
  
      if (!this.tokenNeedsRefreshing(this.props.anonymousToken)) {
        return;
      }
  
      if (this.canTokenRefresh(this.props.anonymousToken)) {
        const accessToken = await this.refreshToken(this.props.anonymousToken);
        if (accessToken) {
          this.props.onAnonymousLogin(accessToken);
        }
  
        return;
      }

      const accessToken = await this.login();

      if (accessToken) {
        this.props.onAnonymousLogin(accessToken);
      }

    } catch (error) {
      console.log("RefreshLogin " + error)
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

    return this.props.anonymousToken ? this.props.children : null;
  }

  /**
   * Logs user in with provided configuration
   */
  private login = async () => {
    const config = Config.getAnonymousLoginConfig();

    const response = await fetch(`${config.url}/realms/${config.realm}/protocol/openid-connect/token`, { 
      method: 'POST',
      body: querystring.stringify({
        grant_type: 'password',
        username: config.username,
        password: config.password,
        client_id: config.clientId
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } 
    });

    return this.buildToken(await response.json());
  }

  /**
   * Refreshes access token if it can be done
   * 
   * @param accessToken Access token
   */
  private refreshToken = async (accessToken: AccessToken) => {
    if (!this.canTokenRefresh(accessToken)) {
      return null;
    }

    const config = Config.getAnonymousLoginConfig();
    
    const response = await fetch(`${config.url}/realms/${config.realm}/protocol/openid-connect/token`, { 
      method: 'POST',
      body: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: accessToken.refresh_token,
        client_id: config.clientId
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      } 
    });

    return this.buildToken(await response.json());
  }

  /**
   * Returns true if token needs refreshing, false otherwise
   * 
   * @param token Access token 
   * @param slackSeconds seconds to use as slack
   */
  private tokenNeedsRefreshing = (token: AccessToken, slackSeconds?: number) => {
    const slack = slackSeconds || REFRESH_INTERVAL_SECONDS + 10;
    const tokenExpirationTimeWithSlack = moment(token.created)
      .add(token.expires_in, "seconds")
      .subtract(slack, "seconds");;

    const currentTime = moment();

    return currentTime.isSameOrAfter(tokenExpirationTimeWithSlack);
  }

  /**
   * Returns true if token can be refreshed using refresh token, false otherwise
   * 
   * @param token Access token
   */
  private canTokenRefresh = (token: AccessToken) => {
    const tokenExpirationTimeWithSlack = moment(token.created)
      .add(token.refresh_expires_in, "seconds")
      .subtract(5, "seconds");

    const currentTime = moment();

    return currentTime.isBefore(tokenExpirationTimeWithSlack);
  }

  /**
   * Builds access token object from login data
   * 
   * @param tokenData token data
   */
  private buildToken = (tokenData: any): AccessToken => {
    const decodedToken: DecodedAccessToken = jwt_decode(tokenData.access_token);
    const created = new Date();

    return {
      created: created,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      refresh_expires_in: tokenData.refresh_expires_in,
      userId: decodedToken.sub,
      realmRoles: decodedToken.realm_access?.roles || []
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
    anonymousToken: state.auth.anonymousToken
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: React.Dispatch<ReduxActions>) {
  return {
    onAnonymousLogin: (anonymousToken: AccessToken) => dispatch(anonymousLogin(anonymousToken))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonymousTokenRefresh) as any;