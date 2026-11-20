import { getAuthToken } from './apiClient';

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_BANNER_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Upload helper using XMLHttpRequest to report progress
 */
function uploadWithProgress(url, formData, onProgress = () => {}) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const token = getAuthToken();

    xhr.open('POST', url, true);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.success) {
          onProgress(100);
          resolve({ url: res.url, key: res.key, error: null });
        } else {
          resolve({ url: null, error: new Error(res.error || `Upload failed with status ${xhr.status}`) });
        }
      } catch (err) {
        resolve({ url: null, error: new Error('Invalid upload response from server') });
      }
    };

    xhr.onerror = () => {
      resolve({ url: null, error: new Error('Network error during upload to cloud storage') });
    };

    xhr.send(formData);
  });
}

export const storageService = {
  /**
   * Validate MP4 video file
   */
  validateVideo(file) {
    if (!file) {
      return { valid: false, error: 'Please select a video file.' };
    }

    const isMp4 = file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
    if (!isMp4) {
      return { valid: false, error: 'Only MP4 video files are allowed.' };
    }

    if (file.size > MAX_VIDEO_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return { 
        valid: false, 
        error: `Video file size (${sizeMB} MB) exceeds the 50 MB limit. Please upload a smaller video.` 
      };
    }

    return { valid: true, error: null };
  },

  /**
   * Validate image file
   */
  validateImage(file, maxSize = MAX_BANNER_SIZE, label = 'Image') {
    if (!file) {
      return { valid: false, error: `Please select an ${label.toLowerCase()} file.` };
    }

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    const hasValidExt = /\.(jpe?g|png|webp|svg)$/i.test(file.name);

    if (!allowedMime.includes(file.type) && !hasValidExt) {
      return { valid: false, error: 'Only JPG, PNG, WebP, and SVG images are allowed.' };
    }

    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return { valid: false, error: `${label} exceeds the ${maxMB} MB limit.` };
    }

    return { valid: true, error: null };
  },

  /**
   * Upload Gallery Image directly to Backblaze B2
   */
  async uploadGalleryImage(file, onProgress = () => {}) {
    const validation = this.validateImage(file, MAX_BANNER_SIZE, 'Gallery Image');
    if (!validation.valid) {
      return { url: null, error: new Error(validation.error) };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'gallery');

    return await uploadWithProgress('/api/admin/upload', formData, onProgress);
  },

  /**
   * Upload Job Vacancy Image directly to Backblaze B2
   */
  async uploadJobImage(file, onProgress = () => {}) {
    const validation = this.validateImage(file, MAX_BANNER_SIZE, 'Job Image');
    if (!validation.valid) {
      return { url: null, error: new Error(validation.error) };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'jobs');

    return await uploadWithProgress('/api/admin/upload', formData, onProgress);
  },

  /**
   * Upload Homepage Banner Image directly to Backblaze B2
   */
  async uploadBannerImage(file, onProgress = () => {}) {
    const validation = this.validateImage(file, MAX_BANNER_SIZE, 'Banner Image');
    if (!validation.valid) {
      return { url: null, error: new Error(validation.error) };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'banners');

    return await uploadWithProgress('/api/admin/upload', formData, onProgress);
  },

  /**
   * Upload Review Video (MP4) directly to Backblaze B2
   */
  async uploadReviewVideo(file, onProgress = () => {}) {
    const validation = this.validateVideo(file);
    if (!validation.valid) {
      return { url: null, error: new Error(validation.error) };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'reviews/videos');

    return await uploadWithProgress('/api/admin/upload', formData, onProgress);
  },

  /**
   * Upload Review Video Thumbnail directly to Backblaze B2
   */
  async uploadReviewThumbnail(file, onProgress = () => {}) {
    const validation = this.validateImage(file, MAX_THUMBNAIL_SIZE, 'Video Thumbnail');
    if (!validation.valid) {
      return { url: null, error: new Error(validation.error) };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'reviews/thumbnails');

    return await uploadWithProgress('/api/admin/upload', formData, onProgress);
  },

  /**
   * Extract video frame thumbnail on the client using HTML5 video and canvas
   */
  async generateVideoThumbnail(videoSource) {
    return new Promise((resolve) => {
      try {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.playsInline = true;

        let videoUrl = videoSource;
        let isObjectUrl = false;

        if (videoSource instanceof File || videoSource instanceof Blob) {
          videoUrl = URL.createObjectURL(videoSource);
          isObjectUrl = true;
        }

        video.src = videoUrl;

        video.onloadeddata = () => {
          video.currentTime = Math.min(1.0, (video.duration || 1) / 2);
        };

        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (isObjectUrl) URL.revokeObjectURL(videoUrl);
            resolve(dataUrl);
          } catch (e) {
            console.warn('Canvas export failed:', e);
            if (isObjectUrl) URL.revokeObjectURL(videoUrl);
            resolve(null);
          }
        };

        video.onerror = () => {
          if (isObjectUrl) URL.revokeObjectURL(videoUrl);
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  },

  /**
   * Upload Company Logo directly to Backblaze B2
   */
  async uploadLogo(file, onProgress = () => {}) {
    const validation = this.validateImage(file, MAX_BANNER_SIZE, 'Logo');
    if (!validation.valid) {
      return { url: null, error: new Error(validation.error) };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'logo');

    return await uploadWithProgress('/api/admin/upload', formData, onProgress);
  },
};
