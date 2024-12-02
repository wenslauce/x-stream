import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

export default function Layout({ 
  children, 
  className,
  fullWidth = false,
  noPadding = false 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <main className={cn(
        "flex-1 w-full",
        "pt-16 md:pt-20", // Account for fixed header
        !noPadding && "pb-8 md:pb-12",
        className
      )}>
        <div className={cn(
          "h-full w-full",
          !fullWidth && "container mx-auto",
          !noPadding && "px-4 md:px-6 lg:px-8"
        )}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}