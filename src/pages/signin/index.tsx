import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitButton } from "~/components/ui/Button";
import Input from "~/components/ui/Input";

const SignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Attempting to sign in with:", { email, password });
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col w-full h-dvh rounded-xl overflow-hidden shadow-sm border border-gray-200">

        <div className="w-fit flex-shrink-0 bg-gray-800 flex flex-col justify-end p-8">
          <p className="font-serif text-2xl whitespace-nowrap text-white leading-tight mb-1">Welcome back.</p>
          <p className="text-xs text-white/40">Sign in to continue</p>
        </div>

        <div className="flex-1 bg-white md:p-10 p-2 flex flex-col justify-center items-center">
          <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-4">Account access</p>
          <h1 className="text-2xl font-serif text-gray-900 mb-7">Sign in</h1>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-5">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex md:w-96 w-full flex-col items-start justify-start space-y-4 ">
            <Input label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="*******" />
            <SubmitButton type="submit" label="Sign In →" className=" w-full" />
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account? <Link href="/signup" className="text-gray-500 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;