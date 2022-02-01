import * as React from "react";
import { KeycloakInstance } from "keycloak-js";
import { AuditLogEntry } from "metaform-react/dist/generated/client/models";
import { SignedToken } from "../../types";
import { Chip, CircularProgress, IconButton, Paper, Typography, withStyles, WithStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { ReduxState } from "../../store";
import Api from "../../api/api";
import styles from "../../styles/admin-audit-logs-screen";
import Config from "../../config";
import moment from "moment";
import AdminLayout from "../layouts/admin-layout";
import { History } from "history";
import strings from "../../localization/strings";
import { AuditLogEntryType } from "../../generated/client";
import { Link, Redirect } from "react-router-dom";
import { AutoSizer, Column, SortDirectionType, Table } from "react-virtualized";
import "react-virtualized/styles.css";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

/**
 * Component properties
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak?: KeycloakInstance;
  signedToken?: SignedToken;
}

/**
 * Component state
 */
interface State {
  loading: boolean;
  error?: string | Error | Response;
  logEntries: AuditLogEntry[];
  filters: AuditLogFilters;
  sortDirection: SortDirectionType;
}

/**
 * Audit log filters
 */
interface AuditLogFilters {
  createdBefore: Date;
  createdAfter: Date;
  userId?: string;
}

/**
 * Component for admin audit trail screen
 */
class AdminAuditTrailScreen extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);

    const dateNow = moment();

    this.state = {
      loading: true,
      logEntries: [],
      sortDirection: "DESC",
      filters: {
        createdBefore: dateNow.toDate(),
        createdAfter: dateNow.subtract(1, "day").toDate()
      }
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const { filters, sortDirection } = this.state;

    this.setState({ loading: true });

    try {
      const logEntries = await this.fetchLogEntries(filters);
      this.setState({ logEntries: this.sortLogEntries(logEntries, sortDirection) });
    } catch (e) {
      this.setState({
        loading: false,
        error: e as any
      });
    }

    this.setState({ loading: false });
  }

  /**
   * Component did update life cycle event
   *
   * @param prevProps previous props
   * @param prevState previous state
   */
  public componentDidUpdate = async (prevProps: Props, prevState: State) => {
    const { filters, sortDirection } = this.state;

    const needsRefresh = JSON.stringify(prevState.filters) !== JSON.stringify(filters);
    const needsSort = prevState.sortDirection !== sortDirection;

    if (!needsRefresh && !needsSort) {
      return;
    }

    try {
      this.setState({ loading: true });

      const logEntries = await this.getLogEntries(needsRefresh);

      this.setState({
        loading: false,
        logEntries: this.sortLogEntries(logEntries, sortDirection)
      })
    } catch (error) {
      this.setState({
        loading: false,
        error: error as any
      });
    }
  }

  /**
   * Component render method
   */
  public render = () => {
    const { keycloak, classes } = this.props;
    const { error } = this.state;

    if (!keycloak) {
      return null;
    }

    if (!keycloak.hasRealmRole("metaform-view-all-audit-logs")) {
      return <Redirect to="/admin"/>;
    }

    return (
      <MuiPickersUtilsProvider utils={ MomentUtils }>
        <AdminLayout
          keycloak={ keycloak }
          error={ error }
          clearError={ () => this.setState({ error: undefined }) }
        >
          <div className={ classes.contentWrapper }>
            { this.renderHeader() }
            { this.renderTable() }
          </div>
        </AdminLayout>
      </MuiPickersUtilsProvider>
    );
  }

  /**
   * Renders header
   */
  private renderHeader = () => {
    const { classes } = this.props;
    const { filters } = this.state;

    return (
      <div className={ classes.header }>
        <Typography variant="h4">
          { strings.adminAuditLogsScreen.title }
        </Typography>
        <div className={ classes.filterWrapper }>
          <DatePicker
            label={ strings.adminAuditLogsScreen.after }
            value={ filters.createdAfter }
            onChange={ this.onDateFilterChange("createdAfter") }
            format="DD.MM.YYYY"
          />
          <DatePicker
            label={ strings.adminAuditLogsScreen.before }
            value={ filters.createdBefore }
            onChange={ this.onDateFilterChange("createdBefore") }
            format="DD.MM.YYYY"
          />
        </div>
      </div>
    );
  }

  /**
   * Renders table
   */
  private renderTable = () => {
    const { classes } = this.props;
    const { loading, logEntries, sortDirection } = this.state;

    if (loading) {
      return null;
    }

    const SortIcon = sortDirection === "DESC" ? ArrowDropDownIcon : ArrowDropUpIcon;

    return (
      <Paper
        elevation={ 0 }
        className={ classes.tableWrapper }
      >
        <AutoSizer>
          { ({ height, width }) => (
            <Table
              width={ width }
              height={ height }
              headerHeight={ 48 }
              rowHeight={ 48 }
              rowCount={ logEntries.length }
              rowGetter={ ({ index }) => logEntries[index] }
              sortDirection={ sortDirection }
              sortBy="createdAt"
              noRowsRenderer={ this.renderNoRows }
            >
              <Column
                label={ strings.adminAuditLogsScreen.date }
                dataKey="createdAt"
                width={ width }
                cellDataGetter={ ({ rowData }) => moment(rowData.createdAt).format("DD.MM.YYYY // HH.mm.ss") }
                headerRenderer={ ({ label }) =>
                  <div className={ classes.createdAtHeader }>
                    { label }
                    <IconButton
                      onClick={ this.onSortDirectionToggle }
                      className={ classes.sortButton }
                    >
                      { <SortIcon fontSize="small"/> }
                    </IconButton>
                  </div>
                }
              />
              <Column
                label={ strings.adminAuditLogsScreen.userId }
                dataKey="userId"
                width={ width }
                flexGrow={ 1 }
              />
              <Column
                label={ strings.adminAuditLogsScreen.replyId }
                dataKey="replyId"
                width={ width }
                flexGrow={ 1 }
                cellRenderer={ ({ cellData }) =>
                  <Link
                    to={ `/admin/replies/${cellData}` }
                    className={ classes.replyLink }
                  >
                    { cellData }
                  </Link>
                }
              />
              <Column
                label={ strings.adminAuditLogsScreen.action }
                dataKey="logEntryType"
                cellDataGetter={ ({ rowData }) =>  rowData.logEntryType }
                width={ width }
                flexGrow={ 1 }
                cellRenderer={ ({ cellData }) =>
                  <Chip
                    variant="outlined"
                    label={ this.displayLogEntryType(cellData as AuditLogEntryType) }
                  />
                }
              />
            </Table>
          ) }
        </AutoSizer>
      </Paper>
    );
  }

  /**
   * Renders no rows indicator or loader if loading
   */
  private renderNoRows = () => {
    const { classes } = this.props;
    const { loading } = this.state;

    if (loading) {
      return (
        <div className={ classes.centerContent }>
          <CircularProgress/>
        </div>
      )
    }

    return (
      <div className={ classes.centerContent }>
        { strings.adminAuditLogsScreen.noRows }
      </div>
    );
  }

  /**
   * Returns current log entries
   *
   * @param needsRefresh whether to fetch new entries or use existing ones
   */
  private getLogEntries = async (needsRefresh: boolean) => {
    const { logEntries, filters } = this.state;

    return needsRefresh ? await this.fetchLogEntries(filters) : logEntries;
  }

  /**
   * Fetches log entries
   *
   * @param filters filters to apply
   */
  private fetchLogEntries = async (filters: AuditLogFilters) => {
    const { signedToken } = this.props;

    if (!signedToken) {
      throw new Error("No token");
    }

    return await Api.getAuditLogEntriesApi(signedToken).listAuditLogEntries({
      metaformId: Config.getMetaformId(),
      createdBefore: moment(filters.createdBefore).toISOString(),
      createdAfter: moment(filters.createdAfter).toISOString(),
      userId: filters.userId
    });
  }

  /**
   * Sorts given log entries
   *
   * @param logEntries log entries to sort
   * @param sortDirection sort direction
   */
  private sortLogEntries = (logEntries: AuditLogEntry[], sortDirection: SortDirectionType) => {
    const entries = [ ...logEntries ];

    entries.sort((entryA, entryB) => {
      const dateA = moment(entryA.createdAt || 0);
      const dateB = moment(entryB.createdAt || 0);

      return dateA.isSame(dateB) ?
        (entryA.replyId || "").localeCompare(entryB.replyId || "") :
        dateA.diff(dateB);
    });

    sortDirection === "DESC" && entries.reverse();

    return entries;
  }

  /**
   * Displays log entry type
   *
   * @param type log entry type
   */
  private displayLogEntryType = (type?: AuditLogEntryType) => type ? ({
    [AuditLogEntryType.CREATEREPLY]: "Luonti",
    [AuditLogEntryType.DELETEREPLY]: "Poisto",
    [AuditLogEntryType.DOWNLOADREPLYATTACHMENT]: "Liitteen lataus",
    [AuditLogEntryType.EXPORTREPLYPDF]: "PDF-vienti",
    [AuditLogEntryType.EXPORTREPLYXLSX]: "XLSX-vienti",
    [AuditLogEntryType.LISTREPLY]: "Listaus",
    [AuditLogEntryType.MODIFYREPLY]: "Muokkaus",
    [AuditLogEntryType.VIEWREPLY]: "Tarkastelu",
    [AuditLogEntryType.VIEWREPLYATTACHMENT]: "Liitteen tarkastelu"
  })[type] : "";

  /**
   * Event handler for table sort
   *
   * @param sortOptions sort options
   */
  private onSortDirectionToggle = () => {
    this.setState({ sortDirection: this.state.sortDirection === "ASC" ? "DESC" : "ASC" });
  }

  /**
   * Event handler for date filter change
   *
   * @param key date filter key
   */
  private onDateFilterChange = (key: "createdBefore" | "createdAfter") => (date: MaterialUiPickersDate) => {
    if (!date) {
      return;
    }

    this.setState({
      filters: {
        ...this.state.filters,
        [key]: date.toDate()
      }
    });
  }

}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 */
const mapStateToProps = (state: ReduxState) => ({
  keycloak: state.auth.keycloak,
  signedToken: state.auth.signedToken
});


export default connect(mapStateToProps)(withStyles(styles)(AdminAuditTrailScreen));