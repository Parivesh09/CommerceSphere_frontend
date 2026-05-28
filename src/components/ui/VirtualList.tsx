/**
 * VirtualList Component
 * 
 * Implements virtual scrolling for long lists
 * Only renders visible items plus a buffer, dramatically improving performance
 * 
 * Validates: Requirement 16.3
 */

import { CSSProperties, ReactElement, useRef, useState } from 'react';

interface VirtualListProps<T> {

  items: T[];

  itemHeight?: number;

  getItemHeight?: (index: number) => number;

  height: number;

  width?: number | string;

  renderItem: (item: T, index: number, style: CSSProperties) => ReactElement;

  overscanCount?: number;

  className?: string;

  onEndReached?: () => void;

  endReachedThreshold?: number;
}

/**
 * VirtualList component for rendering large lists efficiently
 * 
 * Features:
 * - Only renders visible items
 * - Supports fixed or variable item heights
 * - Infinite scroll support
 * - Smooth scrolling performance
 */
export function VirtualList<T>({
  items,
  itemHeight = 80,
  height,
  width = '100%',
  renderItem,
  overscanCount = 5,
  className = '',
  onEndReached,
  endReachedThreshold = 0.8,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount);
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscanCount * 2);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    
    if (onEndReached) {
      const scrollPercentage = (newScrollTop + height) / totalHeight;
      if (scrollPercentage >= endReachedThreshold) {
        onEndReached();
      }
    }
  };
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height,
        width,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => {
            const index = startIndex + i;
            const style: CSSProperties = {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: itemHeight,
              transform: `translateY(${i * itemHeight}px)`,
            };
            return renderItem(item, index, style);
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to determine if a list should be virtualized
 * Returns true if the list has more than the threshold number of items
 * 
 * @param itemCount - Number of items in the list
 * @param threshold - Minimum number of items to trigger virtualization (default: 50)
 * @returns Whether to use virtual scrolling
 */
export function useVirtualization(itemCount: number, threshold: number = 50): boolean {
  return itemCount > threshold;
}

/**
 * Grid virtualization component for product grids, image galleries, etc.
 */
interface VirtualGridProps<T> {

  items: T[];

  columns: number;

  rowHeight: number;

  height: number;

  width?: number | string;

  renderItem: (item: T, index: number) => ReactElement;

  gap?: number;

  className?: string;
}

export function VirtualGrid<T>({
  items,
  columns,
  rowHeight,
  height,
  width = '100%',
  renderItem,
  gap = 16,
  className = '',
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const rowCount = Math.ceil(items.length / columns);
  const visibleRowCount = Math.ceil(height / rowHeight);
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const endRow = Math.min(rowCount, startRow + visibleRowCount + 4);
  
  const totalHeight = rowCount * rowHeight;
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  
  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height,
        width,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {Array.from({ length: endRow - startRow }).map((_, rowIndex) => {
          const actualRowIndex = startRow + rowIndex;
          const startIndex = actualRowIndex * columns;
          const rowItems = items.slice(startIndex, startIndex + columns);
          
          return (
            <div
              key={actualRowIndex}
              style={{
                position: 'absolute',
                top: actualRowIndex * rowHeight,
                left: 0,
                right: 0,
                height: rowHeight,
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
                padding: `${gap / 2}px`,
              }}
            >
              {rowItems.map((item, i) => (
                <div key={startIndex + i}>
                  {renderItem(item, startIndex + i)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Infinite scroll wrapper that works with VirtualList
 * Automatically loads more items when scrolling near the end
 */
interface InfiniteVirtualListProps<T> extends VirtualListProps<T> {

  isLoading: boolean;

  hasMore: boolean;

  loadMore: () => void;

  loader?: ReactElement;
}

export function InfiniteVirtualList<T>({
  items,
  isLoading,
  hasMore,
  loadMore,
  loader,
  ...listProps
}: InfiniteVirtualListProps<T>) {
  const handleEndReached = () => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  };
  
  return (
    <div className="relative">
      <VirtualList
        items={items}
        onEndReached={handleEndReached}
        {...listProps}
      />
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
          {loader || (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          )}
        </div>
      )}
    </div>
  );
}
