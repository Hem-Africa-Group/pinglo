import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { empty, getUserId, json, parseBody } from "./http.js";

const tableName = process.env.STATE_TABLE;
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS") return empty();

  const userId = getUserId(event);
  if (!userId) {
    return json(401, { message: "Missing or invalid x-user-id header" });
  }

  const method = event.requestContext?.http?.method;

  try {
    if (method === "GET") {
      const result = await dynamo.send(new GetCommand({
        TableName: tableName,
        Key: { userId }
      }));

      return json(200, {
        state: result.Item?.state || null,
        updatedAt: result.Item?.updatedAt || null
      });
    }

    if (method === "PUT") {
      const body = parseBody(event);
      if (!body || typeof body.state !== "object" || Array.isArray(body.state)) {
        return json(400, { message: "Request body must be JSON with a state object" });
      }

      const updatedAt = new Date().toISOString();
      await dynamo.send(new PutCommand({
        TableName: tableName,
        Item: {
          userId,
          state: body.state,
          updatedAt
        }
      }));

      return json(200, { ok: true, updatedAt });
    }

    return json(405, { message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return json(500, { message: "Backend error" });
  }
}
