import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
  B2_ENDPOINT,
  B2_REGION,
  B2_BUCKET_NAME,
  B2_APPLICATION_KEY_ID,
  B2_APPLICATION_KEY,
  B2_PREFIX
} = process.env;

const bucket = B2_BUCKET_NAME || 'joymanpowersolution';
const basePrefix = (B2_PREFIX || 'joyman').replace(/^\/+|\/+$/g, '') + '/';

export const s3Client = new S3Client({
  endpoint: B2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com',
  region: B2_REGION || 'us-east-005',
  credentials: {
    accessKeyId: B2_APPLICATION_KEY_ID,
    secretAccessKey: B2_APPLICATION_KEY,
  },
  forcePathStyle: true,
});

/**
 * Validates that an object key belongs to the allowed bucket prefix
 */
export function validateKey(key) {
  if (!key) throw new Error('Object key is required');
  const cleanKey = key.replace(/^\/+/, '');
  if (!cleanKey.startsWith(basePrefix)) {
    throw new Error(`Invalid B2 object key. Must start with '${basePrefix}'`);
  }
  if (cleanKey.includes('..') || cleanKey.includes('\0')) {
    throw new Error('Invalid path characters in B2 object key');
  }
  return cleanKey;
}

/**
 * Converts a B2 object key into the public streaming proxy URL
 */
export function getPublicUrlForKey(key) {
  if (!key) return null;
  const cleanKey = key.replace(/^\/+/, '');
  return `/api/media/stream/${cleanKey}`;
}

/**
 * Extracts the B2 object key from a full URL or streaming path
 */
export function extractKeyFromUrl(urlOrKey) {
  if (!urlOrKey) return null;
  if (typeof urlOrKey !== 'string') return null;

  // If it's already a clean key like joyman/banners/123.jpg
  if (urlOrKey.startsWith(basePrefix)) {
    return urlOrKey;
  }

  // If it's a streaming URL like /api/media/stream/joyman/banners/123.jpg
  const streamPrefix = '/api/media/stream/';
  const idx = urlOrKey.indexOf(streamPrefix);
  if (idx !== -1) {
    return urlOrKey.slice(idx + streamPrefix.length);
  }

  // If it's a direct B2 URL like https://.../bucket/joyman/...
  const bucketPrefix = `/${bucket}/`;
  const bIdx = urlOrKey.indexOf(bucketPrefix);
  if (bIdx !== -1) {
    return urlOrKey.slice(bIdx + bucketPrefix.length);
  }

  return null;
}

/**
 * Upload a file Buffer directly to Backblaze B2
 * @param {Buffer} buffer 
 * @param {string} originalName 
 * @param {string} mimeType 
 * @param {string} subFolder - e.g. 'logo', 'banners', 'gallery', 'reviews/videos', 'reviews/thumbnails', 'resumes'
 */
export async function uploadToB2(buffer, originalName, mimeType, subFolder = 'general') {
  if (!buffer) throw new Error('File buffer is required for upload');

  const cleanSub = subFolder.replace(/^\/+|\/+$/g, '');
  const ext = path.extname(originalName || '').toLowerCase() || '.bin';
  const uniqueId = `${Date.now()}_${randomUUID().slice(0, 8)}`;
  const key = `${basePrefix}${cleanSub}/${uniqueId}${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType || 'application/octet-stream',
    })
  );

  const url = getPublicUrlForKey(key);
  return { key, url };
}

/**
 * Delete an object from Backblaze B2
 */
export async function deleteFromB2(keyOrUrl) {
  const key = extractKeyFromUrl(keyOrUrl);
  if (!key) return false;

  try {
    const validatedKey = validateKey(key);
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: validatedKey,
      })
    );
    return true;
  } catch (err) {
    console.warn(`[B2] Failed to delete object '${key}':`, err.message);
    return false;
  }
}

/**
 * Get an object stream from Backblaze B2 with optional HTTP Range header support
 */
export async function getObjectFromB2(key, range = null) {
  const validatedKey = validateKey(key);
  const commandInput = {
    Bucket: bucket,
    Key: validatedKey,
  };

  if (range) {
    commandInput.Range = range;
  }

  const response = await s3Client.send(new GetObjectCommand(commandInput));
  return response;
}

/**
 * Generate a short-lived presigned download URL for private assets (e.g., resumes)
 */
export async function getPresignedDownloadUrl(keyOrUrl, expiresInSeconds = 300) {
  const key = extractKeyFromUrl(keyOrUrl);
  if (!key) throw new Error('Invalid resume key for signed URL');

  const validatedKey = validateKey(key);
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: validatedKey,
    ResponseContentDisposition: 'attachment',
  });

  return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

export default {
  s3Client,
  uploadToB2,
  deleteFromB2,
  getObjectFromB2,
  getPresignedDownloadUrl,
  getPublicUrlForKey,
  extractKeyFromUrl,
  validateKey,
};
