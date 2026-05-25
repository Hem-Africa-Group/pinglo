# Pinglo AWS Backend

This backend replaces the browser-only `localStorage` persistence in your Pinglo frontend with AWS:

- API Gateway HTTP API
- Lambda on Node.js 20
- DynamoDB for the app state
- S3 presigned URLs for message attachments

## Deploy

Install the AWS SAM CLI, configure AWS credentials, then run:

```bash
cd backend
npm install
sam build
sam deploy --guided
```

When SAM asks for `AllowedOrigin`, use your frontend URL, for example `https://example.com`. For local testing you can use `*`.

After deploy, copy the `ApiUrl` output.

## Frontend Wiring

Add this config near the top of your frontend JavaScript:

```js
const API_BASE_URL = "https://your-api-id.execute-api.us-east-1.amazonaws.com";
```

Then replace your current synchronous `loadState` and `saveState` startup flow with the async version in `frontend/pinglo-aws-client.js`.

The backend expects an `x-user-id` header. The client uses `state.profile.id` once available and falls back to `me`.

For real production auth, put Amazon Cognito in front of the API and replace `x-user-id` with the authenticated subject from the JWT authorizer.
