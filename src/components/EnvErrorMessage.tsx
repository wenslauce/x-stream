import { AlertTriangle } from 'lucide-react';

interface EnvErrorMessageProps {
  missingVars: string[];
}

export default function EnvErrorMessage({ missingVars }: EnvErrorMessageProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Missing Environment Variables
          </h2>
          
          <div className="space-y-2">
            <p className="text-gray-400">
              The following environment variables are required but not set:
            </p>
            <ul className="text-red-400 space-y-1">
              {missingVars.map(varName => (
                <li key={varName} className="font-mono bg-red-950/50 py-1 rounded">
                  {varName}
                </li>
              ))}
            </ul>
          </div>

          <div className="prose prose-sm prose-invert">
            <p className="text-gray-400">
              Please make sure to:
            </p>
            <ol className="text-left text-gray-400 list-decimal pl-4 space-y-2">
              <li>Create a <code className="text-cyan-400">.env</code> file in your project root</li>
              <li>Add the required environment variables</li>
              <li>Redeploy your application</li>
            </ol>
          </div>

          <p className="text-sm text-gray-500">
            For more information, check the documentation or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}