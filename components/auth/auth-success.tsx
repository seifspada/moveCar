interface AuthSuccessProps {
  message: string;
}

export function AuthSuccess({ message }: AuthSuccessProps) {
  if (!message) return null;

  return (
    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-green-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
