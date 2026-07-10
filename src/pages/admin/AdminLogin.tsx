import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInAdmin } from "@/lib/adminAuth";

export default function AdminLogin() {
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
      await signInAdmin(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-stone-dark p-8">
        <p className="eyebrow text-gold mb-3">Style & Glitz</p>
        <h1 className="font-heading text-3xl text-forest mb-8">Admin Login</h1>

        <label className="block text-xs text-graphite/60 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-stone-dark px-3 py-2 mb-4 bg-transparent focus:outline-none focus:border-forest"
        />

        <label className="block text-xs text-graphite/60 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-stone-dark px-3 py-2 mb-6 bg-transparent focus:outline-none focus:border-forest"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-cream eyebrow py-3 hover:bg-forest-dark transition-colors duration-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}