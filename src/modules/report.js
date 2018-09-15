/**
 * Actions
 */
export const SEND_ERROR_REPORT = "SEND_ERROR_REPORT";
export const sendErrorReport = (error, info) => ({
  type: SEND_ERROR_REPORT,
  error,
  info
});
