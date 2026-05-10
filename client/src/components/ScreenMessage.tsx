interface ScreenMessageProps {
  message: string;
  type?: 'default' | 'error';
}

export function ScreenMessage({ message, type = 'default' }: ScreenMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className={`text-center text-lg ${type === 'error' ? 'text-red-600' : 'text-gray-700'}`}>
        {message}
      </p>
    </div>
  );
}
