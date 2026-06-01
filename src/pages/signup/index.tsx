import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitButton } from "~/components/ui/Button";
import Input from "~/components/ui/Input";
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
    localStorage.removeItem("c_team")
    signup.mutate({ name, email, username, password, image: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col w-full h-dvh rounded-xl overflow-hidden shadow-sm border border-gray-200">

        <div className="w-fit flex-shrink-0 bg-gray-800 flex flex-col justify-end p-8">
          <p className="font-serif text-2xl whitespace-nowrap text-white leading-tight mb-1">Create account.</p>
          <p className="text-xs text-white/40">Join us today</p>
        </div>

        <div className="flex-1 bg-white md:p-10 p-2 flex flex-col justify-center items-center">
          <p className="text-[11px] font-medium tracking-widest text-gray-400 uppercase mb-4">New account</p>
          <h1 className="text-2xl font-serif text-gray-900 mb-7">Sign up</h1>

          {error && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-5">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="md:w-96 w-full space-y-4 ">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name" value={name} onChange={setName} placeholder="Enter Your Full Name" />
              <Input label="Username" value={username} onChange={setUsername} placeholder="Enter Username" />
            </div>
            <Input label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="******" />
            <SubmitButton type="submit" label={signup.isPending ? "Creating account..." : "Sign up →"} className=" w-full" />
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-gray-500 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;