import React, { Component } from "react";
import message from "antd/lib/message";
import Toast from "antd-mobile/lib/toast";
import { connect } from "react-redux";
import { isMobileOnly } from "react-device-detect";
import { delSystemMessage } from "../modules/systemMessage";

export const withSystemMessage = WrappedComponent => {
  class SystemMessage extends Component {
    setting = {
      autoHide: 0, // 改為手動關閉提示
      duration: 2000 // ms
    };

    componentDidMount() {
      message.config({
        maxCount: 1
      });
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.messageQueue.size === this.props.messageQueue.size) return;

      // 移除一筆通知
      if (prevProps.messageQueue.size > this.props.messageQueue.size) {
        isMobileOnly ? Toast.hide() : message.destroy();
      }

      // 沒有通知
      if (!this.props.messageQueue.size) return;

      // 新增一筆通知
      const targetMessage = this.props.messageQueue.first();
      const { id, level, content } = targetMessage.toJS();
      switch (level) {
        case "info":
        case "loading":
        case "success":
          isMobileOnly
            ? Toast[level](content, this.setting.autoHide)
            : message[level](content, this.setting.autoHide);
          break;
        case "error":
          isMobileOnly
            ? Toast.fail(content, this.setting.autoHide)
            : message.error(content, this.setting.autoHide);
          break;
        default:
          console.error(
            "Invalid system message level. Accept info, success, error, loading.",
            level
          );
          return;
      }

      // 延遲一段時間移除通知
      setTimeout(() => {
        this.props.delSystemMessage(id);
      }, this.setting.duration);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    messageQueue: state.getIn(["ui", "systemMessage"])
  });
  return connect(
    mapStateToProps,
    { delSystemMessage }
  )(SystemMessage);
};
