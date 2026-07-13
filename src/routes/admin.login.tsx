import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageBackdrop } from "@/components/site/PageBackdrop";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin sign in — PrepBuddy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/resources" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/admin/resources" });
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main>
        <section className="relative">
          <PageBackdrop />
          <div className="mx-auto max-w-md px-5 py-20">
            <h1 className="font-display text-3xl font-bold text-center">Admin sign in</h1>
            <p className="mt-2 text-sm text-ink-muted text-center">
              Restricted access. Contact the site owner if you need credentials.
            </p>
            <form onSubmit={onSubmit} className="mt-8 glass-strong rounded-3xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
                  className="w-full rounded-xl border border-input bg-white px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required
                  className="w-full rounded-xl border border-input bg-white px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full pill-btn pill-btn-primary pill-btn-primary-hover h-12 disabled:opacity-70">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
