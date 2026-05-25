import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { empty, json, parseBody } from "./http.js";
import { v4 as uuidv4 } from "uuid";

const tableName = process.env.ADMIN_TABLE;
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS") return empty();

  const method = event.requestContext?.http?.method;
  const path = event.rawPath || "";

  try {
    if (method === "GET" && path.endsWith("/admin/dashboard")) {
      const [staff, logs] = await Promise.all([
        listByType("staff"),
        listByType("log")
      ]);
      return json(200, {
        staff,
        logs: logs.map((item) => item.message || JSON.stringify(item)).slice(-100),
        pinglo: [
          { id: "moderation", name: "Pinglo moderation", type: "safety", status: "review ready" },
          { id: "payments", name: "H.E.M Pay", type: "billing", status: "payment integration pending" },
          { id: "appeals", name: "Core appeals", type: "operations", status: "ready" }
        ],
        nodes: [
          { name: "pinglo-api", ip: "API Gateway + Lambda", region: process.env.AWS_REGION || "aws", status: "active" },
          { name: "pinglo-state", ip: "DynamoDB SSE", region: process.env.AWS_REGION || "aws", status: "encrypted" },
          { name: "pinglo-uploads", ip: "S3 private bucket", region: process.env.AWS_REGION || "aws", status: "locked" }
        ],
        cloudflare: [
          { name: "core.hemafrica.com", status: "API ready", detail: "Connect zone token in backend only" },
          { name: "pinglo.hemafrica.com", status: "WAF ready", detail: "Route frontend through Cloudflare" }
        ]
      });
    }

    if (method === "POST" && path.endsWith("/admin/staff")) {
      const body = parseBody(event);
      if (!body.name || !body.email) return json(400, { message: "name and email are required" });
      const staff = {
        pk: "staff",
        sk: `staff_${Date.now()}_${uuidv4()}`,
        id: uuidv4(),
        name: String(body.name).slice(0, 120),
        email: String(body.email).toLowerCase().slice(0, 160),
        role: String(body.role || "Core Staff").slice(0, 80),
        status: "queued_for_aws_provisioning",
        createdAt: new Date().toISOString()
      };
      await dynamo.send(new PutCommand({ TableName: tableName, Item: staff }));
      await writeLog(`Staff provisioning queued for ${staff.email}`);
      return json(201, staff);
    }

    if (method === "POST" && path.endsWith("/admin/logs")) {
      const body = parseBody(event);
      await writeLog(String(body.message || "Core event").slice(0, 500));
      return json(201, { ok: true });
    }

    return json(404, { message: "Admin route not found" });
  } catch (error) {
    console.error(error);
    return json(500, { message: "Admin backend error" });
  }
}

async function listByType(type) {
  const result = await dynamo.send(new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: { ":pk": type },
    Limit: 100,
    ScanIndexForward: false
  }));
  return result.Items || [];
}

async function writeLog(message) {
  await dynamo.send(new PutCommand({
    TableName: tableName,
    Item: {
      pk: "log",
      sk: `log_${Date.now()}_${uuidv4()}`,
      message,
      createdAt: new Date().toISOString()
    }
  }));
}
