import { toast } from 'sonner';

export const handleDownloadFile = async (url: string, filename?: string) => {
  try {
    if (url.startsWith('blob:') || url.startsWith('data:') || new URL(url).origin === window.location.origin) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || url.split('/').pop() || 'download';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const response = await fetch(url);

      if (!response.ok) {
        toast.error(`下载失败: ${response.status} ${response.statusText}`);
        throw new Error(`下载失败: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || url.split('/').pop() || 'download';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.error('文件下载失败:', error);
    throw error;
  }
};

export class KeyFormatter {
  static capitalizeKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(KeyFormatter.capitalizeKeys);
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          const newKey = key.charAt(0).toUpperCase() + key.slice(1);
          return [newKey, KeyFormatter.capitalizeKeys(value)];
        })
      );
    }
    return obj;
  }

  static lowercaseKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(KeyFormatter.lowercaseKeys);
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          const newKey = key.charAt(0).toLowerCase() + key.slice(1);
          return [newKey, KeyFormatter.lowercaseKeys(value)];
        })
      );
    }
    return obj;
  }
}
