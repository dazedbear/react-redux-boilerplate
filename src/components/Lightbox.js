import React, { Component, createContext, Fragment } from "react";
import Modal from "antd/lib/modal";

// FIXME: 再遇到 connect 時會無法重新 render
const { Provider, Consumer } = createContext();

// lightbox modal HOC, 實際處理的核心, 每個 react app 只會有一個, 且放置在最上層
const withLightboxContainer = WrappedComponent =>
  class LightboxContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: false,

        // options
        title: "",
        modalClassName: "",
        width: "620px",
        closable: false,
        maskClosable: true,

        // render
        renderContent: undefined,

        // hooks
        onOkHandler: undefined,
        onCancelHandler: undefined,
        afterCloseHandler: undefined
      };

      // 傳給子元件用的 interface
      this.interface = {
        visible: this.state.visible,
        toggleDisplay: this.toggleDisplay,
        setOptions: this.setOptions
      };
    }

    // 切換顯示隱藏
    toggleDisplay = visible => this.setState({ visible });

    // 設定 lightbox 選項
    setOptions = (options = {}) => {
      this.setState(state => ({ ...state, ...options }));
    };

    // 處理 lightbox callback
    hookHanlder = (name, ...args) => {
      switch (name) {
        case "onOk":
          this.toggleDisplay(false);
          this.state.onOkHandler && this.state.onOkHandler();
          break;
        case "onCancel":
          this.toggleDisplay(false);
          this.state.onCancelHandler && this.state.onCancelHandler();
          break;
        case "afterClose":
          this.state.afterCloseHandler && this.state.afterCloseHandler();
          break;
        default:
          console.error("invalid handler name in Lightbox", name);
      }
    };

    renderHandler = () =>
      this.state.renderContent ? this.state.renderContent() : null;

    render() {
      return (
        <Fragment>
          <Provider value={this.interface}>
            <Modal
              id="lightbox"
              // centered={ true } // 垂直置中
              footer={null} // 底部內容，當不需要默認底部按鈕時，可以設為 footer={ null }
              keyboard={true} // 是否支持鍵盤esc關閉
              destroyOnClose={true} // 關閉時銷毀 Modal 裡的子元素
              mask={true} // 是否展示遮罩
              maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // 遮罩樣式
              zIndex={1500} // 設置 Modal 的 z-index，默認值為1000
              className={`lightbox-mode ${this.state.modalClassName}`}
              title={this.state.title || ""} // 標題
              visible={this.state.visible} // 對話框是否可見
              closable={this.state.closable || false} // 是否顯示右上角的關閉按鈕
              width={this.state.width || "620px"} // 寬度
              maskClosable={this.state.maskClosable || true} // 點擊遮罩層是否允許關閉
              onOk={this.hookHanlder.bind(this, "onOk")} // 點擊確定回調
              onCancel={this.hookHanlder.bind(this, "onCancel")} // 點擊遮罩層或右上角叉或取消按鈕的回調
              afterClose={this.hookHanlder.bind(this, "afterClose")} // Modal 完全關閉後的回調
            >
              {this.renderHandler()}
            </Modal>
            <WrappedComponent {...this.props} />
          </Provider>
        </Fragment>
      );
    }
  };

// lightbox HOC, 方便直接在生命週期使用, 不用寫到 render 中
const withLightbox = WrappedComponent =>
  React.forwardRef((props, ref) => (
    <Consumer>
      {lightbox => (
        <WrappedComponent {...props} lightbox={lightbox} ref={ref} />
      )}
    </Consumer>
  ));

// lightbox wrap component, 將 HOC 多包一層元件, 方便直接在 render 中使用
class Lightbox extends Component {
  componentDidMount() {
    this.props.lightbox.setOptions({
      title: this.props.title,
      modalClassName: this.props.modalClassName,
      width: this.props.width,
      closable: this.props.closable,
      maskClosable: this.props.maskClosable,
      onOkHandler: this.props.onOn,
      onCancelHandler: this.props.onCancel,
      afterCloseHandler: this.props.afterClose,
      renderContent: () =>
        React.Children.map(
          this.props.children,
          child =>
            React.isValidElement(child)
              ? React.cloneElement(child, this.props.passingProps)
              : null
        )
    });
    if (this.props.visible) {
      this.props.lightbox.toggleDisplay(true);
    }
  }
  componentDidUpdate() {
    this.props.lightbox.toggleDisplay(this.props.visible);
  }
  render() {
    return null;
  }
}

export default withLightbox(Lightbox);
export { withLightbox, withLightboxContainer };
