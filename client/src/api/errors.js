export function getApiErrorMessage(error) {
  if (error?.userMessage) {
    return error.userMessage;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.request) {
    return "Unable to reach the server. Please try again.";
  }

  return error?.message || "Something went wrong. Please try again.";
}