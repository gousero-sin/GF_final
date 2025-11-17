'use client';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-background theme-transition flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* GO Logo with animated glow */}
        <div className="relative">
          <h1 className="text-6xl font-thin tracking-widest go-neon">
            GO
          </h1>
          {/* Animated ring around logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-primary/20 rounded-full animate-spin" style={{
              borderTopColor: 'var(--primary)',
              animationDuration: '2s'
            }} />
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground font-thin tracking-wide">
            {message}
          </p>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="w-64 mx-auto">
          <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
            <div className="h-full bg-primary rounded-full theme-transition" style={{
              width: '60%',
              animation: 'pulse-width 2s ease-in-out infinite'
            }} />
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground font-thin mt-8">
          Neo-Chinese Neon Aesthetic
        </p>
      </div>
    </div>
  );
}