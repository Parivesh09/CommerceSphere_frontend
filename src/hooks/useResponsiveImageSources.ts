/**
 * Hook to generate responsive image sources based on base URL
 * Useful when images follow a naming convention like image-400.jpg, image-800.jpg
 * 
 * Validates: Requirements 12.4
 */

export function useResponsiveImageSources(
  baseUrl: string,
  widths: number[] = [400, 800, 1200, 1600]
): Array<{ url: string; width: number }> {
  return widths.map((width) => {

    const lastDot = baseUrl.lastIndexOf('.');
    const extension = lastDot !== -1 ? baseUrl.substring(lastDot) : '';
    const basePath = lastDot !== -1 ? baseUrl.substring(0, lastDot) : baseUrl;

    return {
      url: `${basePath}-${width}${extension}`,
      width,
    };
  });
}
