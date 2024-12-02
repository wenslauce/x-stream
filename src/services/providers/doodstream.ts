interface DoodStreamResponse {
  success: boolean;
  msg: string;
  result: {
    download_url: string;
    quality: string;
    size: string;
    title: string;
  }[];
}

interface DoodStreamOptions {
  quality?: 'auto' | '720' | '480' | '360';
  token?: string;
}

export class DoodStreamProvider {
  private static readonly BASE_URL = 'https://dood.yt';
  private static readonly EMBED_URL = 'https://dood.yt/e';
  private static readonly API_URL = 'https://dood.yt/api';

  static isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('dood.');
    } catch {
      return false;
    }
  }

  static formatVideoId(id: string): string {
    // Remove any prefixes or paths, just get the video ID
    return id.split('/').pop()?.replace(/^[de]\//, '') || id;
  }

  static buildEmbedUrl(videoId: string, options: DoodStreamOptions = {}): string {
    const formattedId = this.formatVideoId(videoId);
    const params = new URLSearchParams();
    
    if (options.quality) {
      params.append('quality', options.quality);
    }
    
    if (options.token) {
      params.append('token', options.token);
    }

    const url = `${this.EMBED_URL}/${formattedId}`;
    const queryString = params.toString();
    
    return queryString ? `${url}?${queryString}` : url;
  }

  static extractVideoId(url: string): string | null {
    if (!this.isValidUrl(url)) return null;

    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      // DoodStream URLs usually have the format: /e/VIDEOID or /d/VIDEOID
      return pathParts[pathParts.length - 1] || null;
    } catch {
      return null;
    }
  }

  static getQualityFromSize(size: string): string {
    const sizeInMB = parseFloat(size);
    if (sizeInMB > 700) return '720p';
    if (sizeInMB > 400) return '480p';
    return '360p';
  }

  static async getVideoInfo(videoId: string): Promise<{
    title: string;
    qualities: { label: string; url: string }[];
  }> {
    try {
      const formattedId = this.formatVideoId(videoId);
      const response = await fetch(`${this.API_URL}/file/info?file_code=${formattedId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`DoodStream API error: ${response.status}`);
      }

      const data = await response.json() as DoodStreamResponse;
      
      if (!data.success) {
        throw new Error(data.msg || 'Failed to get video info');
      }

      return {
        title: data.result[0]?.title || 'Unknown Title',
        qualities: data.result.map(item => ({
          label: this.getQualityFromSize(item.size),
          url: item.download_url
        }))
      };
    } catch (error) {
      console.error('Error fetching DoodStream video info:', error);
      throw error;
    }
  }

  static sanitizeUrl(url: string): string {
    // Remove any tracking parameters or unnecessary additions
    try {
      const urlObj = new URL(url);
      const essentialParams = new URLSearchParams();
      
      // Only keep necessary parameters
      if (urlObj.searchParams.has('quality')) {
        essentialParams.append('quality', urlObj.searchParams.get('quality')!);
      }
      
      const cleanUrl = `${urlObj.origin}${urlObj.pathname}`;
      const queryString = essentialParams.toString();
      
      return queryString ? `${cleanUrl}?${queryString}` : cleanUrl;
    } catch {
      return url;
    }
  }
}