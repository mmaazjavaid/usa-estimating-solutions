'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setError(payload.message ?? 'Login failed.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
        <p className="text-sm text-zinc-400">
          Sign in with your configured admin credentials.
        </p>

        <div className="space-y-1">
          <label className="text-sm text-zinc-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-zinc-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
            required
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full rounded-md bg-white px-3 py-2 text-sm font-medium text-black disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
