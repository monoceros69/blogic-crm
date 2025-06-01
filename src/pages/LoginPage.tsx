import React, { useState } from 'react';
import bcrypt from 'bcryptjs';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // In a real app, you'd hash the password and send it to a secure backend.
      // For this example with json-server, we'll fetch users and compare.
      const response = await fetch('/api/users');
      const users = await response.json();

      const user = users.find((u: any) => u.username === username);

      if (user && await bcrypt.compare(password, user.password)) {
        // Basic login successful - store login state (e.g., in localStorage)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        localStorage.setItem('isAdmin', String(user.isAdmin)); // Store admin status
        window.location.replace('/contracts'); // Force redirect to the contracts page
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex items-baseline justify-end">
              {/* <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a> */}
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-900">Login</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 