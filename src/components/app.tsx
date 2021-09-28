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
import SignedTokenRefresh from "./containers/signed-token-refresh";
import moment from "moment";
import "moment/locale/fi";
import "moment/locale/en-gb";
import FormScreen from "./screens/form-screen";
import AdminScreen from "./screens/admin-screen";
import AdminReplyScreen from "./screens/admin-reply-screen";
import AdminInviteScreen from "./screens/admin-invite-screen";
import FormEditJsonScreen from "./screens/json-screen";
import FormEditScreen from "./screens/form-edit-screen";
import PreviewScreen from "./screens/preview-screen";

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
      <>
        <CssBaseline />
        <Provider store={store}>     
          <BrowserRouter>
            <div className="App">
              <Switch>
                <Route
                  path="/"
                  exact={ true }
                  render={({ history, location }) => (
                    <AnonymousTokenRefresh>
                      <FormScreen
                        history={ history }
                        location={ location }
                      />
                    </AnonymousTokenRefresh>
                  )}
                />
                <Route
                  path="/protected/form"
                  exact={ true }
                  render={({ history, location }) => (
                    <SignedTokenRefresh loginMode="USER">
                      <FormScreen
                        history={ history }
                        location={ location }
                      />
                    </SignedTokenRefresh>
                  )}
                />
                <Route
                  path="/admin"
                  exact={ true }
                  render={({ history }) => (
                    <SignedTokenRefresh loginMode="ADMIN">
                      <AdminScreen
                        history={ history }
                      />
                    </SignedTokenRefresh>
                  )}
                />
                <Route
                  path="/admin/edit-form/json"
                  exact={ true }
                  render={({ history }) => (
                    <SignedTokenRefresh loginMode="ADMIN">
                      <ThemeProvider theme={theme}>
                        <FormEditJsonScreen
                          history={ history }
                        />
                      </ThemeProvider>
                    </SignedTokenRefresh>
                  )}
                />
                <Route
                  path="/admin/edit-form/form"
                  exact={ true }
                  render={({ history }) => (
                    <SignedTokenRefresh loginMode="ADMIN">
                      <ThemeProvider theme={theme}>
                        <FormEditScreen
                          history={ history }
                        />
                      </ThemeProvider>
                    </SignedTokenRefresh>
                  )}
                />
                <Route
                  path="/admin/edit-form/preview"
                  exact={ true }
                  render={({ history }) => (
                    <SignedTokenRefresh>
                      <ThemeProvider theme={theme}>
                        <PreviewScreen
                          history={ history }
                        />
                      </ThemeProvider>
                    </SignedTokenRefresh>
                  )}
                />
                <Route
                  path="/admin/invite"
                  exact={ true }
                  render={({ history, match }) => (
                    <SignedTokenRefresh loginMode="ADMIN">
                      <AdminInviteScreen                            
                        history={ history }
                      />
                    </SignedTokenRefresh>
                  )}
                />
                <Route
                  path="/admin/replies/:replyId"
                  exact={ true }
                  render={({ history, match }) => (
                    <SignedTokenRefresh loginMode="ADMIN">
                      <AdminReplyScreen                            
                        history={ history }
                        replyId={ match.params.replyId }
                      />
                    </SignedTokenRefresh>
                  )}
                />
              </Switch>
            </div>
          </BrowserRouter>
        </Provider>
      </>
    );
  }
}

export default App;