'use client';

import { Button } from '@/components/ui/button';
import { useCounterStore } from '@/store/useCounterStore';

export default function Home() {
  const { count, increase, decrease } = useCounterStore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-3xl font-bold">Counter: {count}</h1>
      <div className="space-x-4">
        <Button onClick={decrease} variant="outline">
          -
        </Button>
        <Button onClick={increase}>+</Button>
      </div>
    </div>
  );
}
