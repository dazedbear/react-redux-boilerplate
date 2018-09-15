import React, { Component, Fragment } from "react";
import { compose } from "recompose";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import Dropdown from "antd/lib/dropdown";
import stateMachine from "../statemachines";
import { SiteTitle, IconButton, ThemeLink } from "./Atoms";

const { Header } = Layout;

class AppBar extends Component {
  state = {
    sideMenuCollapsed: true
  };

  toggleSideMenu = () => {
    this.setState({
      sideMenuCollapsed: !this.state.sideMenuCollapsed
    });
  };

  render() {
    return (
      <Fragment>
        <Header
          style={{
            width: "100%",
            padding: 0,
            minHeight: "50px"
          }}
        >
          <IconButton
            type={this.state.sideMenuCollapsed ? "menu-unfold" : "menu-fold"}
            onClick={this.toggleSideMenu}
          />

          <SiteTitle>
            <ThemeLink to="/">網站標題</ThemeLink>
          </SiteTitle>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>Sign In</Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <IconButton type="user" />
          </Dropdown>
        </Header>
      </Fragment>
    );
  }
}

export default AppBar;
