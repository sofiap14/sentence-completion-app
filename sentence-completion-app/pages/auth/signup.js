import { useState } from 'react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Changed from 'name' to 'username'
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }), // Changed 'name' to 'username'
      });

      if (res.ok) {
        setMessage('User registered successfully! Please log in.');
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 mb-4 block w-full"
          required
        />
        <input
          type="text"
          value={username} // Changed from 'name' to 'username'
          onChange={(e) => setUsername(e.target.value)} // Changed 'setName' to 'setUsername'
          placeholder="Username" // Changed placeholder from 'Name' to 'Username'
          className="border p-2 mb-4 block w-full"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 mb-4 block w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
