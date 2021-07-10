import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/form-edit-screen";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InfoIcon from '@material-ui/icons/Info';

import { History } from "history";
import { WithStyles, withStyles, Grid, Box, Typography, List, ListItemText } from "@material-ui/core";
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
      value: "",
      readOnly: true,
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

      this.setState({
        loading: false,
        metaform: metaform
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  };

  /**
   * Component render method
   */
  public render = () => {
    const { metaform,
            loading, 
            error
          } = this.state;

    const { classes, keycloak } = this.props;

    return (
      <AdminLayoutV2
        keycloak={ keycloak }
        metaform={ metaform }
        loading={ loading || !metaform }
        error={ error }
        clearError={ this.clearError }
      >
        <Grid container className={ classes.root }>
          { this.renderLeftSideBar() }
          { this.renderFormEditor() }
          { this.renderRightSideBar() }
        </Grid>
      </AdminLayoutV2>
    );
  };

  /**
   * Method for rendering form editor
   */
  private renderFormEditor = () => {
    return (
      <Grid item md={ 8 } className={ this.props.classes.formEditor }>
        <Box className={ this.props.classes.editableForm }>
          { this.state.metaform?.title } 
        </Box>
      </Grid>
    )
  }

  /**
   * Method for rendering left sidebar
   */
  private renderLeftSideBar = () => {
    return (
      <Grid item md={ 2 } className={ this.props.classes.sideBar }>
        <Grid item md={ 6 } className={ this.props.classes.sideBarTabs }>
          <h5>{ strings.formEditScreen.leftSideBarComponentsTab }</h5>
        </Grid>
        <Grid item md={ 6 } className={ this.props.classes.sideBarTabs }>
          <h5> { strings.formEditScreen.leftSideBarStylingTab }</h5>
        </Grid>
        <hr />
        <Typography variant="caption">
          <InfoIcon />
          { strings.formEditScreen.leftSideBarInfo }
        </Typography>
        { this.renderFields() }
        { this.renderComponents() }
      </Grid>
    );
  }

  /**
   * Method for rendering right sidebar
   */
  private renderRightSideBar = () => {
    return (
      <Grid item md={ 2 } className={ this.props.classes.sideBar }>
        <Grid item md={ 6 } className={ this.props.classes.sideBarTabs }>
          <h5>{ strings.formEditScreen.rightSideBarLinksTab }</h5>
        </Grid>
        <Grid item md={ 6 } className={ this.props.classes.sideBarTabs }>
          <h5>{ strings.formEditScreen.rightSideBarVisibilityTab }</h5>
        </Grid>
      <hr />
        <Typography variant="caption">
          <InfoOutlinedIcon color="disabled" />
          { strings.formEditScreen.chooseComponent }
        </Typography>
      </Grid>
    );
  }

  /**
   * Method for rendering addable fields
   */
  private renderFields = () => {
    const listOfFields : string[] = [
                                    `${ strings.formEditScreen.sectionLayout }`,
                                    `${ strings.formEditScreen.headerField }`,
                                    `${ strings.formEditScreen.textField }`,
                                    `${ strings.formEditScreen.editableTextField }`,
                                    `${ strings.formEditScreen.conditionalField }`
                                  ];

    return (
      <List>
        <Box border={ 1 } className={ this.props.classes.fieldHeader }>
          <ListItemText>
            <Typography>
              { strings.formEditScreen.leftSideBarFieldHeader }
            </Typography>
          </ListItemText>
        </Box>
        { listOfFields.map((field: string, index: number) => (
          <Box border={ 1 } className={ this.props.classes.fields } key={ index } >
            <ListItemText>
              <Typography>{ field }</Typography>
            </ListItemText>
          </Box>
        )) }
      </List>
    );
  }

  /**
   * Method for rendering addable components
   */
   private renderComponents = () => {
    const listOfComponents : string[] = [
                                    `${ strings.formEditScreen.dropDownMenu }`,
                                    `${ strings.formEditScreen.selectBox }`,
                                    `${ strings.formEditScreen.radioButton }`,
                                    `${ strings.formEditScreen.button }`,
                                    `${ strings.formEditScreen.image }`
                                  ];

    return (
      <List>
        <Box border={ 1 } className={ this.props.classes.componentHeader }>
          <ListItemText>
            <Typography>
              { strings.formEditScreen.leftSideBarComponentHeader }
            </Typography>
          </ListItemText>
        </Box>
        { listOfComponents.map((component: string, index: number) => (
          <Box border={ 1 } className={ this.props.classes.fields } key={ index }>
            <ListItemText>
              <Typography>{ component }</Typography>
            </ListItemText>
          </Box>
        )) }
      </List>
    );
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
