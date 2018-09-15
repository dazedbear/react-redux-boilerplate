const config = {
  stage: process.env.REACT_APP_STAGE,
  api: "/ajax",
  endpoints: {
    errorReport: "http://localhost:3000"
  }
};

export default config;
