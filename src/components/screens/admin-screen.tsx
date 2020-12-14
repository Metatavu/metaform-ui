import * as React from "react";
import moment from "moment";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxActions, ReduxState } from "../../store";
import styles from "../../styles/admin-screen";

import { History } from "history";
import { WithStyles, withStyles, Button, Typography, Select, MenuItem, InputLabel } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { KeycloakInstance } from "keycloak-js";
// eslint-disable-next-line max-len
import { AccessToken } from '../../types';
import strings from "../../localization/strings";
import Api from "../../api/api";
import { Metaform, Reply, MetaformField, MetaformFieldType } from "../../generated/client";
import Config from "../../config";
import AdminLayout from "../layouts/admin-layout";
import Utils from "../../utils";
import ConfirmDialog from "../generic/confirm-dialog";


/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  adminToken: AccessToken;
}

/**
 * Component state
 */
interface State {
  error?: string | Error | Response;
  loading: boolean;
  replies: Reply[];
  metaform?: Metaform;
  filterId?: string;
  deleteReplyId?: string;
}

/**
 * Component for admin screen
 */
export class AdminScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {      
      loading: false,
      replies: []
    };
  }

  /**
   * Component did update life cycle handler
   *
   * @param _prevProps previous props
   * @param prevState previous state
   */
  public componentDidUpdate = async (_prevProps: Props, prevState: State) => {
    if (this.state.filterId !== prevState.filterId) {
      try {
        this.setState({
          loading: true
        });
  
        const repliesApi = Api.getRepliesApi(this.props.adminToken);
  
        const [ replies ] = await Promise.all([
          repliesApi.listReplies({
            metaformId: Config.getMetaformId(),
            fields: this.getFilterFields(this.state.metaform, this.state.filterId)
          })
        ]);
  
        this.setState({
          loading: false,
          replies: replies
        });
      } catch (e) {
        this.setState({
          loading: false,
          error: e
        });
      }
    }
  }
  
  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    try {
      this.setState({
        loading: true
      });

      const repliesApi = Api.getRepliesApi(this.props.adminToken);
      const metaformsApi = Api.getMetaformsApi(this.props.adminToken);

      const metaform = await metaformsApi.findMetaform({
        metaformId: Config.getMetaformId()
      });

      const filterId = (metaform.filters || [])[0]?.id;

      const [ replies ] = await Promise.all([
        repliesApi.listReplies({
          metaformId: Config.getMetaformId(),
          fields: this.getFilterFields(metaform, filterId)
        })
      ]);

      this.setState({
        loading: false,
        filterId: filterId,
        replies: replies,
        metaform: metaform
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
    const { metaform } = this.state;
    const { classes } = this.props;

    return (
      <AdminLayout keycloak={ this.props.keycloak } loading={ this.state.loading || !metaform } error={ this.state.error } clearError={ this.clearError }>
        <div className={ classes.topBar }>
          <Typography className={ classes.title } variant="h2">{ strings.adminScreen.title }</Typography>
          <div className={ classes.topBarButton }>
            <Button variant="contained" className={ classes.topBarButton } onClick={ this.onExportXlsxClick }>{ strings.adminScreen.exportXlsx }</Button>            
          </div>
        </div>
        { this.renderFilters(metaform) }
        { this.renderReplies(metaform) }
        { this.renderDeleteReplyConfirm() }
      </AdminLayout>
    );
  }

  /**
   * Renders filters select
   * 
   * @param metaform metaform
   */
  private renderFilters = (metaform?: Metaform) => {
    const filters = metaform?.filters || [];
    const { classes } = this.props;
    const { filterId } = this.state;

    return (
      <div className={ classes.filters }>        
        <div className={ classes.filterPrefixContainer }></div>
        <div className={ classes.filterSelectContainer }>
          <InputLabel shrink id="filters-select-label">{ strings.adminScreen.filterLabel }</InputLabel>

          <Select id="filter-select" labelId="filters-select-label" value={ filterId || "all" } onChange={ this.onFilterChange }>
            {
              filters.map(filter => <MenuItem value={ filter.id }>{  filter.name }</MenuItem>)
            }
            <MenuItem value={ "all" }>{ strings.adminScreen.filterShowAll }</MenuItem>
          </Select>
        </div>
      </div>
    ); 
  }

  /**
   * Renders replies table
   * 
   * @param metaform metaform
   */
  private renderReplies = (metaform?: Metaform) => {
    if (!metaform) {
      return
    }

    const fields = this.getFields(metaform);
    const { classes } = this.props;

    return (
      <Table className={ classes.table }>
        { this.renderTableHead(fields) } 
        { this.renderTableBody(fields) }
      </Table>
    );
  }

  /**
   * Renders table head
   * 
   * @param fields table fields
   */
  private renderTableHead = (fields: MetaformField[]) => {        
    return (
      <TableHead>
        <TableRow>
          { fields.map(field => <TableCell> { field.title } </TableCell> ) }
          <TableCell align="right"/>
        </TableRow>
      </TableHead>
    );
  }

  /**
   * Renders table body
   * 
   * @param fields table fields
   */
  private renderTableBody = (fields: MetaformField[]) => {        
    return (
      <TableBody>
        { this.state.replies.map(reply => this.renderReply(fields, reply)) }
      </TableBody>
    );
  }

  /**
   * Renders a reply
   * 
   * @param fields table fields
   * @param reply reply
   */
  private renderReply = (fields: MetaformField[], reply: Reply) => {
    return (
      <TableRow>
        { fields.map(field => this.renderReplyData(field, reply)) }
        <TableCell align="right">
          <Button variant="contained" color="primary" onClick={ () => this.onReplyOpenClick(reply) }>
            { strings.adminScreen.openReply }
          </Button>
          <Button style={{ marginLeft: 10 }} variant="contained" color="secondary" onClick={ () => this.onReplyDeleteClick(reply) }>
            { strings.adminScreen.deleteReply }
          </Button>
        </TableCell>
      </TableRow>
    );
  }

  /**
   * Renders field reply data
   * 
   * @param field field
   * @param reply reply
   */
  private renderReplyData = (field: MetaformField, reply: Reply) => {
    return <TableCell> { this.getDisplayReplyData(field, reply) } </TableCell>
  }

  /**
   * Renders delete reply confirm dialog
   */
  private renderDeleteReplyConfirm = () => {
    return (
      <ConfirmDialog 
        onClose={ this.onReplyDeleteClose }
        onCancel={ this.onReplyDeleteCancel }
        onConfirm={ this.onReplyDeleteConfirm }
        cancelButtonText={ strings.generic.cancel }
        positiveButtonText={ strings.generic.confirm }
        title={ strings.adminScreen.confirmDeleteReplyTitle }
        text={ strings.adminScreen.confirmDeleteReplyText }
        open={ !!this.state.deleteReplyId } 
      />
    );
  }

  /**
   * Deletes a reply
   * 
   * @param replyId reply id
   */
  private deleteReply = async (replyId: string) => {
    try {
      const { metaform, replies } = this.state;
      if (!metaform || !metaform.id) {
        return;
      }

      this.setState({
        loading: true
      });

      const repliesApi = Api.getRepliesApi(this.props.adminToken);

      await repliesApi.deleteReply({
        metaformId: metaform.id,
        replyId: replyId
      });

      this.setState({
        loading: false,
        replies: replies.filter(item => item.id !== replyId)
      });

    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  }

  /**
   * Clears error
   */
  private clearError = () => {
    this.setState({ 
      error: undefined 
    });
  }

  /**
   * Returns display data for field in given reply
   * 
   * @param field field
   * @param reply reply
   * @return field reply display data
   */
  private getDisplayReplyData = (field: MetaformField, reply: Reply) => {
    const replyData = reply.data;
    const fieldName = field.name;
    
    if (!replyData || !fieldName) {
      return "";
    }

    const fieldValue = replyData[fieldName];
    if (!fieldValue) {
      return "";
    }

    const fieldOptions = field.options || [];

    switch (field.type) {
      case MetaformFieldType.Date:
        return moment(fieldValue).format("L")
      case MetaformFieldType.DateTime:
        return moment(fieldValue).format("LL")
      case MetaformFieldType.Select:
      case MetaformFieldType.Radio:
        return fieldOptions.find(fieldOption => fieldOption.name === fieldValue.toString())?.text || fieldValue;
      default:
        return fieldValue;
    }
  }

  /**
   * Returns table field from metaform
   * 
   * @param metaform metaform
   */
  private getFields = (metaform: Metaform) => {
    return (metaform.sections || [])
      .flatMap(section => section.fields || [])
      .filter(field => (field.contexts || []).includes("MANAGEMENT_LIST"));    
  }

  /**
   * Returns filters field
   * 
   * @param metaform metaform
   * @param filterId filter id
   */
  private getFilterFields = (metaform?: Metaform, filterId?: string) => {
    if (!filterId || !metaform || !metaform.filters) {
      return undefined;
    }

    return metaform.filters.find(filter => filter.id === filterId)?.fields;
  }

  /**
   * Event handler for filter select change
   * 
   * @param event event
   */
  private onFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({
      filterId: (event.target.value as string) || undefined
    });
  }

  /**
   * Reply open click button handler
   * 
   * @param reply reply
   */
  private onReplyOpenClick = (reply: Reply) => {
    this.props.history.push(`/admin/replies/${reply.id}`);
  }

  /**
   * Event handler for reply delete click
   * 
   * @param reply reply
   */
  private onReplyDeleteClick = (reply: Reply) => {
    this.setState({
      deleteReplyId: reply.id
    });
  }

  /**
   * Event handler for XLSX export button click
   */
  private onExportXlsxClick = async () => {
    try {
      this.setState({
        loading: true
      });

      const repliesApi = Api.getRepliesApi(this.props.adminToken);

      const data = await repliesApi._export({
        format: "XLSX",
        metaformId: Config.getMetaformId()
      });

      Utils.downloadBlob(data, "replies.xlsx");

      this.setState({
        loading: false
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: e
      });
    }
  }

  /**
   * Event handler for reply confirm dialog cancel
   */
  private onReplyDeleteCancel = () => {
    this.setState({
      deleteReplyId: undefined
    });
  }

  /**
   * Event handler for reply confirm dialog close
   */
  private onReplyDeleteClose = () => {
    this.setState({
      deleteReplyId: undefined
    });
  }

  /**
   * Event handler for reply confirm dialog confirm
   */
  private onReplyDeleteConfirm = async () => {
    const { deleteReplyId } = this.state;
    if (deleteReplyId) {
      this.deleteReply(deleteReplyId);
    }

    this.setState({
      deleteReplyId: undefined
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
    adminToken: state.auth.adminToken as AccessToken
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AdminScreen));
