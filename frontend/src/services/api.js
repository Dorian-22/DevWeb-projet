const baseUrl = "http://localhost:3000";
export default function api(pathOrEndpoint, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  if (localStorage.getItem("token")) {
    defaultHeaders["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  }
  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };
  if (options.body && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
  }
  return fetch(`${baseUrl}${pathOrEndpoint}`, options);
}