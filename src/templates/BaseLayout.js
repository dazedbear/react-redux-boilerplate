import React, { Component } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withLightboxContainer } from "../components/Lightbox";
import { withSystemMessage } from "../containers/SystemMessage";
import { pushSystemMessage } from "../modules/systemMessage";
import { sendErrorReport } from "../modules/report";
import Layout from "antd/lib/layout";
import Landing from "./LandingPage";
import ErrorPage from "./ErrorPage";
import AppBar from "../components/AppBar";

class BaseLayout extends Component {
  componentDidMount() {
    // Global Side Effects Here
  }
  componentDidCatch(error, info) {
    console.error(error, info);
    this.props.sendErrorReport(error, info);
  }

  render() {
    return (
      <Layout style={{ minHeight: "100%" }}>
        <AppBar />
        <Layout>
          <Layout.Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: 280
            }}
          >
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/error" exact component={ErrorPage} />
              <Redirect to="/error" />
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default compose(
  withRouter,
  // withSystemMessage,
  // withLightboxContainer,
  connect(
    null,
    {
      pushSystemMessage,
      sendErrorReport
    }
  )
)(BaseLayout);
