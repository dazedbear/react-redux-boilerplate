# 基礎專案模板

## Features

- 內建常見共用元件 (支援 RWD & mobile)
  - Lightbox 彈出視窗
  - SystemMessage 全局提示
  - AppBar 頂端列 (含登入登出)
- 更細膩的 API 處理，包含 debounce、cancel 等
- 商務邏輯統一整在 logic


## Folder Structure & Principle

- components
  - 不需要使用 connect 的元件
  - atoms、mocules 等級的元件，狀態一律存在元件 state 中
  - 若要對外暴露狀態與方法：render props / context API + hoc
- containers
  - 需要 connect 的元件
  - orgnism 等級以上，狀態一律使用 stateMachine 管理
  - 複雜的商務邏輯寫在 logics 中，這邊僅負責狀態呈現
  - 觸發商務邏輯的 action 定義在 stateMachine 中
- config
  - 設定檔，包含文案、endpoints
  - 視覺設定檔，包含 theme 等
- modules
  - 由 redux-saga 撰寫，包含兩種
    - 底層模組，處理共用的純資料處理部分，不牽涉任何 UI stateMachine 改變
    - 功能命名的各種商務邏輯，可以更動 store、特定 containers stateMachine 狀態
