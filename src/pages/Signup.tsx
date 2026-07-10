import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpCustomer } from "@/lib/customerAuth";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signUpCustomer(email, password, fullName);
      if (data.session) {
        navigate("/account");
      } else {
        setConfirmationSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-6 text-center">
        <div>
          <p className="eyebrow text-gold mb-4">Almost There</p>
          <h1 className="font-heading text-3xl text-forest mb-4">Check Your Email</h1>
          <p className="text-graphite/60 max-w-sm">
            We sent a confirmation link to {email}. Click it to activate your account, then come
            back and sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6 pt-20">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-stone-dark p-8">
        <p className="eyebrow text-gold mb-3">Style & Glitz</p>
        <h1 className="font-heading text-3xl text-forest mb-8">Create Account</h1>

        <label className="block text-xs text-graphite/60 mb-1">Full Name</label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input mb-4"
        />

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
          minLength={6}
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
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-xs text-graphite/50 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gold-dark hover:text-forest">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}