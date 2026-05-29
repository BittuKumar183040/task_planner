import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/utils/api";

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signup = api.user.signup.useMutation({
    onSuccess: async () => {
      await signIn("credentials", { email, password, redirect: false });
      router.push("/dashboard");
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup.mutate({ name, email, username, password, image: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full h-dvh rounded-xl overflow-hidden shadow-sm border border-gray-200">

        <div className="w-fit flex-shrink-0 bg-[#1a1a2e] flex flex-col justify-end p-8">
          <p className="font-serif text-2xl whitespace-nowrap text-white leading-tight mb-1">Create account.</p>
          <p className="text-xs text-white/40">Join us today</p>
        </div>

        <div className="flex-1 bg-white p-10 flex flex-col justify-center">
          <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-4">New account</p>
          <h1 className="text-2xl font-serif text-gray-900 mb-7">Sign up</h1>

          {error && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-5">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Username</label>
                <input
                  value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>
            <button
              type="submit"
              disabled={signup.isPending}
              className="w-full h-10 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {signup.isPending ? "Creating account..." : "Sign up →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/signin" className="text-violet-500 font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;