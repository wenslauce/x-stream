import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link 
      to="/" 
      className={cn(
        "group relative flex items-center gap-3 select-none",
        "transition-all duration-300 transform hover:scale-105",
        className
      )}
    >
      {/* Logo Icon */}
      <div className="relative">
        <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
          <X className="w-6 h-6 text-white z-10" strokeWidth={3} />
          {/* Futuristic elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_60%)]" />
          <div className="absolute w-full h-[1px] bg-white/30 top-1/2 -translate-y-1/2 animate-[scan_2s_ease-in-out_infinite]" />
        </div>
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={cn(
          "text-2xl font-bold tracking-wider",
          "bg-clip-text text-transparent",
          "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600",
          "animate-gradient bg-[length:200%_auto]"
        )}>
          X-STREAM
        </span>
        <span className="text-[0.65rem] text-gray-400 tracking-[0.2em] uppercase">
          Beyond Entertainment
        </span>
      </div>

      {/* Futuristic Decorative Elements */}
      <div className="absolute -inset-1 border border-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -inset-[3px] border border-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Interactive Hover Line */}
      <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" />
    </Link>
  );
}