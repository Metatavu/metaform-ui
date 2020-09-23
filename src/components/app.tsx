import * as React from "react";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { ReduxState, ReduxActions, rootReducer } from "../store";

import { ThemeProvider } from "@material-ui/styles";
import metaformTheme from "../styles/theme";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CssBaseline, responsiveFontSizes } from "@material-ui/core";
import strings from "../localization/strings";
import AnonymousTokenRefresh from "./containers/anonymous-token-refresh";
import AdminTokenRefresh from "./containers/admin-token-refresh";
import moment from "moment";
import "moment/locale/fi";
import "moment/locale/en-gb";
import FormScreen from "./screens/form-screen";
import AdminScreen from "./screens/admin-screen";
import AdminReplyScreen from "./screens/admin-reply-screen";

const store = createStore<ReduxState, ReduxActions, any, any>(rootReducer);

/**
 * Interface representing component properties
 */
interface Props {
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Material UI's automated responsive font sizes
 */
const theme = responsiveFontSizes(metaformTheme);

/**
 * App component
 */
class App extends React.Component<Props, State> {

  /**
   * Component did mount life cycle component
   */
  public componentDidMount = () => {
    moment.locale(strings.getLanguage());
  }

  /**
   * Component render method
   */
  public render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>     
          <BrowserRouter>
            <div className="App">
              <Switch>
                <Route
                  path="/"
                  exact={ true }
                  render={({ history }) => (
                    <AnonymousTokenRefresh>
                      <FormScreen
                        history={ history }
                      />
                    </AnonymousTokenRefresh>
                  )}
                />
                <Route
                  path="/admin"
                  exact={ true }
                  render={({ history }) => (
                    <AdminTokenRefresh>
                      <AdminScreen
                        history={ history }
                      />
                    </AdminTokenRefresh>
                  )}
                />
                <Route
                  path="/admin/replies/:replyId"
                  exact={ true }
                  render={({ history, match }) => (
                    <AdminTokenRefresh>
                      <AdminReplyScreen                            
                        history={ history }
                        replyId={ match.params.replyId }
                      />
                    </AdminTokenRefresh>
                  )}
                />
              </Switch>
            </div>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;