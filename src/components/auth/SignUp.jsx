import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      navigate('/browse');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-brand-gray p-8 rounded-lg w-full max-w-md shadow-2xl">
      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
      {error && <p className="text-brand-red bg-red-900/20 p-3 rounded mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 rounded bg-[#333] border-none focus:ring-2 focus:ring-brand-red outline-none"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min. 6 chars)"
          className="w-full p-3 rounded bg-[#333] border-none focus:ring-2 focus:ring-brand-red outline-none"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-brand-red py-3 rounded font-bold hover:bg-red-700 transition">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-gray-400">
        Already have an account? <Link to="/login" className="text-white hover:underline">Log in.</Link>
      </p>
    </div>
  );
};

export default SignUp;