import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-edit-screen";

import { History } from "history";
import { WithStyles, withStyles, Grid } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken } from '../../types';
import Api from "../../api/api";
import { Metaform } from "../../generated/client";
import strings from "../../localization/strings";
import Config from "../../config";
import AdminLayoutV2 from "../layouts/admin-layout-v2";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  signedToken: AccessToken;
}

/**
 * Component state
 */
interface State {
  error?: string | Error | Response;
  loading: boolean;
  metaform?: Metaform;
  value:string;
  metaformJson : string;
  readOnly: boolean;
}

/**
 * Component for editing Metaform
 */
export class FormEditScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {      
      loading: false,
      value:"",
      metaformJson:"",
      readOnly:true
    };
  }
  
  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const { signedToken } = this.props;

    try {
      this.setState({
        loading: true
      });

      const metaformsApi = Api.getMetaformsApi(signedToken);

      /**
       * Load test metaform
       */
      const metaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });

      /**
       * Create mutable copy of metaform json
       */
      const metaformJson = JSON.stringify(metaform, null, 2)

      this.setState({
        loading: false,
        metaform: metaform,
        metaformJson : metaformJson
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
    const { 
      metaform, 
      metaformJson, 
      loading, error 
    } = this.state;

    const { classes, keycloak } = this.props;

    return (
      <AdminLayoutV2 
        keycloak={ keycloak } 
        metaform={ metaform }
        loading={ loading || !metaform } 
        error={ error } 
        clearError={ this.clearError }
      >
        <Grid container className={classes.root}>
          <Grid item md={ 2 } className={ classes.sideBar }>
        
          </Grid>
          <Grid item md={ 8 } className={ classes.formEditor }>
            
          </Grid>
          <Grid item md={ 2 } className={ classes.sideBar }>
       
          </Grid>
        </Grid>
      </AdminLayoutV2>
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FormEditScreen));
