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
import strings from "../../localization/strings";
import Config from "../../config";
import AdminLayoutV2 from "../layouts/admin-layout-v2";
import { Controlled as CodeMirror } from "react-codemirror2";
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import codemirror from "codemirror";
import { loadMetaform, setMetaform, setMetaformJson } from "../../actions/metaform";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  signedToken: AccessToken;
  metaform?: Metaform;
  metaformJson: string;
  metaformIsLoading: boolean;
  onLoadMetaform: () => void;
  onSetMetaform: (metaform?: Metaform) => void;
  onSetMetaformJson: (metaformJson: string) =>  void;
}

/**
 * Component state
 */
interface State {
  error?: string | Error | Response;
  value:string;
  readOnly: boolean;
}

/**
 * Component for viewing and editing Metaform JSON
 */
export class FormEditJsonScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {      
      value: "",
      readOnly: true
    };
  }
  
  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const {
      metaform,
      signedToken, 
      metaformIsLoading,
      onLoadMetaform, 
      onSetMetaform
    } = this.props;

    if (metaformIsLoading || metaform) {
      return;
    }

    try {
      onLoadMetaform();

      const metaformsApi = Api.getMetaformsApi(signedToken);

      // Load test metaform
      const loadedMetaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });


      onSetMetaform(loadedMetaform);
    } catch (e) {
      this.setState({
        error: e
      });

      onSetMetaform(undefined);
    }
  }
  
  /**
   * Component render method
   */
  public render = () => {
    const { error } = this.state;
    const { 
      classes, 
      keycloak, 
      metaform, 
      metaformJson, 
      metaformIsLoading 
    } = this.props;

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
        loading={ metaformIsLoading || !metaform } 
        error={ error } 
        clearError={ this.clearError }
      >
        <Grid container className={classes.root}>
          <Grid item md={ 2 } className={ classes.sideBar }>
        
          </Grid>
          <Grid item md={ 8 } className={ classes.jsonEditor }>
            <Typography align="center" variant="h4" >
              { strings.jsonScreen.title }
            </Typography> 
            <Button color="primary" variant="outlined" className={ classes.toggleReadOnlyButton } onClick={ this.toggleMutableJson }>{ this.state.readOnly ? `${ strings.jsonScreen.toggleReadOnlyButtonEdit }` : `${ strings.jsonScreen.toggleReadOnlyButtonPreview }` }</Button>
            <CodeMirror 
              className={ classes.codeMirror }
              value={metaformJson}
              options={ jsonEditorOptions }
              onBeforeChange={this.onCodeMirrorBeforeJsonChange}
            />
          </Grid>
          <Grid item md={ 2 } className={ classes.sideBar }>
          </Grid>
        </Grid>
      </AdminLayoutV2>
    );
  }
  
  /**
   * Event handler for CodeMirror before JSON code change event
   *
   * @param editor editor instance
   * @param data editor data
   * @param value code
   */
  private onCodeMirrorBeforeJsonChange = (editor: codemirror.Editor, data: codemirror.EditorChange, value: string) => {
    this.setState({
      metaformJson: value
    });
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
    signedToken: state.auth.signedToken as AccessToken,
    metaform: state.metaform.metaform,
    metaformJson: state.metaform.metaformJson,
    metaformIsLoading: state.metaform.isLoading
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    onLoadMetaform: () => dispatch(loadMetaform()),
    onSetMetaform: (metaform?: Metaform) => dispatch(setMetaform(metaform)),
    onSetMetaformJson: (metaformJson: string) => dispatch(setMetaformJson(metaformJson))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FormEditJsonScreen));
