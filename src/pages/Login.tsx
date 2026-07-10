import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInCustomer } from "@/lib/customerAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInCustomer(email, password);
      navigate("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6 pt-20">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-stone-dark p-8">
        <p className="eyebrow text-gold mb-3">Style & Glitz</p>
        <h1 className="font-heading text-3xl text-forest mb-8">Sign In</h1>

        <label className="block text-xs text-graphite/60 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input mb-4"
        />

        <label className="block text-xs text-graphite/60 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input mb-6"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-cream eyebrow py-3 hover:bg-forest-dark transition-colors duration-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-xs text-graphite/50 text-center mt-6">
          New here?{" "}
          <Link to="/signup" className="text-gold-dark hover:text-forest">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}