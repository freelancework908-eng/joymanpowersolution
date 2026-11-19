import express from 'express';
import { getObjectFromB2, validateKey } from '../b2.js';

const router = express.Router();

/**
 * Public Streaming Endpoint for B2 Media (Logo, Banners, Gallery, Review Thumbnails, Review Videos)
 * Supports HTTP Range Requests for MP4 video seeking.
 * Strictly prevents public streaming of candidate resumes.
 */
// Stream public asset by key
router.get(/^\/stream\/(.+)$/, async (req, res) => {
  try {
    const rawKey = req.params[0];
    if (!rawKey) {
      return res.status(400).json({ error: 'Asset key parameter is required' });
    }

    const key = validateKey(rawKey);

    // Security check: Never stream private resumes through public media endpoint
    if (key.includes('/resumes/') || key.endsWith('/resumes')) {
      return res.status(403).json({ error: 'Access denied: Resumes are private candidate records.' });
    }

    const range = req.headers.range;
    const s3Response = await getObjectFromB2(key, range);

    const contentType = s3Response.ContentType || 'application/octet-stream';
    const contentLength = s3Response.ContentLength;
    const contentRange = s3Response.ContentRange;
    const acceptRanges = s3Response.AcceptRanges || 'bytes';
    const etag = s3Response.ETag;

    res.set({
      'Content-Type': contentType,
      'Accept-Ranges': acceptRanges,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    });

    if (etag) res.set('ETag', etag);

    if (range && contentRange) {
      // Partial content for video streaming & audio seek
      res.status(206);
      res.set({
        'Content-Range': contentRange,
        'Content-Length': contentLength,
      });
    } else if (contentLength !== undefined) {
      res.set('Content-Length', contentLength);
    }

    // Pipe the S3 readable stream to the client response
    if (s3Response.Body && typeof s3Response.Body.pipe === 'function') {
      s3Response.Body.pipe(res);
    } else if (s3Response.Body && typeof s3Response.Body.transformToByteArray === 'function') {
      const bytes = await s3Response.Body.transformToByteArray();
      res.send(Buffer.from(bytes));
    } else {
      res.end();
    }
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      return res.status(404).json({ error: 'Media asset not found in storage' });
    }
    console.error('[Media Stream Error]:', err.message);
    return res.status(500).json({ error: 'Failed to stream media asset' });
  }
});

export default router;
