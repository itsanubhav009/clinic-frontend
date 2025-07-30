"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Hospital } from 'lucide-react';
import { register } from '../lib/api';
export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setIsLoading(true);
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false); return;
    }
    try {
      await register({ email, password });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => { router.push('/login'); }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
                <Hospital className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md" placeholder="Email address" required />
          </div>
          <div>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-md" placeholder="Password (min. 6 characters)" required />
          </div>
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
          {success && <p className="text-sm text-center text-green-400">{success}</p>}
          <button type="submit" disabled={isLoading}
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-800">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
