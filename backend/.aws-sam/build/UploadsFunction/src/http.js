const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": allowedOrigin,
      "access-control-allow-headers": "content-type,x-user-id,authorization",
      "access-control-allow-methods": "GET,POST,PUT,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

export function empty(statusCode = 204) {
  return {
    statusCode,
    headers: {
      "access-control-allow-origin": allowedOrigin,
      "access-control-allow-headers": "content-type,x-user-id,authorization",
      "access-control-allow-methods": "GET,POST,PUT,OPTIONS"
    },
    body: ""
  };
}

export function getUserId(event) {
  const headers = event.headers || {};
  const userId = headers["x-user-id"] || headers["X-User-Id"];
  if (!userId || !/^[a-zA-Z0-9:_@.-]{1,128}$/.test(userId)) {
    return "";
  }
  return userId;
}

export function parseBody(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  return JSON.parse(raw);
}
