import { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`w-full h-screen flex flex-col ${className}`}>
      {/* Mobile: Full screen vertical layout */}
      <div className="md:hidden w-full h-full flex flex-col">
        {children}
      </div>

      {/* Tablet: Centered with padding */}
      <div className="hidden md:flex lg:hidden w-full h-full items-center justify-center p-4">
        <div className="w-full max-w-2xl h-full flex flex-col">
          {children}
        </div>
      </div>

      {/* Desktop: Centered with max width */}
      <div className="hidden lg:flex w-full h-full items-center justify-center p-8">
        <div className="w-full max-w-4xl h-full max-h-[900px] flex flex-col shadow-2xl rounded-lg overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

interface GameLayoutProps {
  statusBar?: ReactNode;
  gameCanvas: ReactNode;
  sidePanel?: ReactNode;
  bottomControls?: ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  statusBar,
  gameCanvas,
  sidePanel,
  bottomControls
}) => {
  return (
    <>
      {/* Mobile Layout (< 768px) */}
      <div className="md:hidden w-full h-full flex flex-col">
        {statusBar && <div className="flex-shrink-0">{statusBar}</div>}
        <div className="flex-1 min-h-0">{gameCanvas}</div>
        {bottomControls && <div className="flex-shrink-0">{bottomControls}</div>}
      </div>

      {/* Tablet Layout (768px - 1024px) */}
      <div className="hidden md:flex lg:hidden w-full h-full flex-col">
        {statusBar && <div className="flex-shrink-0">{statusBar}</div>}
        <div className="flex-1 min-h-0 flex gap-4 p-4">
          <div className="flex-1">{gameCanvas}</div>
          {sidePanel && <div className="w-64 flex-shrink-0">{sidePanel}</div>}
        </div>
        {bottomControls && <div className="flex-shrink-0">{bottomControls}</div>}
      </div>

      {/* Desktop Layout (>= 1024px) */}
      <div className="hidden lg:flex w-full h-full">
        <div className="flex-1 flex flex-col">
          {statusBar && <div className="flex-shrink-0">{statusBar}</div>}
          <div className="flex-1 min-h-0 flex gap-6 p-6">
            {sidePanel && (
              <div className="w-72 flex-shrink-0 bg-gray-800/50 rounded-lg p-4">
                {sidePanel}
              </div>
            )}
            <div className="flex-1">{gameCanvas}</div>
          </div>
          {bottomControls && <div className="flex-shrink-0">{bottomControls}</div>}
        </div>
      </div>
    </>
  );
};

// Hook to detect screen size
export const useScreenSize = () => {
  const getScreenSize = () => {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  return getScreenSize();
};
