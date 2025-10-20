/**
 * HTTP Request Options
 */
export interface HttpRequestOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: string | number | boolean };
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer';
  withCredentials?: boolean;
  reportProgress?: boolean;
}

/**
 * Upload Progress Event
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
