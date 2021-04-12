import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/json-screen";

import { History } from "history";
import { WithStyles, withStyles, Button, Typography, Grid } from "@material-ui/core";
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken } from '../../types';
import Api from "../../api/api";
import { Metaform } from "../../generated/client";
import Config from "../../config";
import AdminLayoutV2 from "../layouts/admin-layout-v2";
import { Controlled as CodeMirror } from "react-codemirror2";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";

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
 * Component for json screen
 */
export class JsonScreen extends React.Component<Props, State> {

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
    const { metaform, metaformJson, loading, error } = this.state;
    const { classes, keycloak } = this.props;
    const jsonEditorOptions = {
                                mode: "javascript",
                                json: true,
                                theme: "material",
                                lineNumbers: true,
                                gutter: true,
                                lineWrapping: true,
                                matchBrackets: true,
                                dragDrop: false,
                                readOnly: this.state.readOnly
                            };

    return (
      <AdminLayoutV2 
        keycloak={ keycloak } 
        metaform={ metaform }
        loading={ loading || !metaform } 
        error={ error } 
        clearError={ this.clearError }
      >
        <Grid container className={ classes.root }>
          <Grid item md={ 12 }>
            <Typography align="center" variant="h4">
                Jsonin esikatselu
            </Typography> 
          </Grid>
          <Grid item md={ 3 }>
        
          </Grid>
          <Grid item md={ 6 } className={ classes.jsonEditor }>
          <Button color="primary" variant="outlined" className={ classes.toggleReadOnlyButton } onClick={ this.toggleMutableJson }>{this.state.readOnly ? "Muokkaus päälle" : "Muokkaus Pois"}</Button>
            <CodeMirror 
              className={ classes.codeMirror }
              value={metaformJson}
              options={ jsonEditorOptions }
              onBeforeChange={(editor, data, value) => {
                this.setState({metaformJson: value})
                }}
              />
          </Grid>
          <Grid item md={ 3 }>
       
          </Grid>
        </Grid>
      </AdminLayoutV2>
    );
  }

/**
 * Toggle json readOnly/Writable
 */
  private toggleMutableJson = () => {
    const { readOnly } = this.state;
    this.setState({ 
      readOnly: !readOnly
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(JsonScreen));
