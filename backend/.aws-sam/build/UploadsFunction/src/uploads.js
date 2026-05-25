import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import { empty, getUserId, json, parseBody } from "./http.js";

const bucketName = process.env.UPLOAD_BUCKET;
const s3 = new S3Client({});

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS") return empty();

  const userId = getUserId(event);
  if (!userId) {
    return json(401, { message: "Missing or invalid x-user-id header" });
  }

  try {
    const body = parseBody(event);
    const fileName = cleanFileName(body.fileName);
    const contentType = cleanContentType(body.contentType);

    if (!fileName || !contentType) {
      return json(400, { message: "fileName and contentType are required" });
    }

    const key = `uploads/${encodeURIComponent(userId)}/${uuid()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
    return json(200, {
      uploadUrl,
      key,
      expiresIn: 900
    });
  } catch (error) {
    console.error(error);
    return json(500, { message: "Backend error" });
  }
}

function cleanFileName(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 160);
}

function cleanContentType(value) {
  const contentType = String(value || "").trim().toLowerCase();
  return /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/.test(contentType) ? contentType : "";
}
