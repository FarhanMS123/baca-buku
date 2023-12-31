import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { XCircle } from "lucide-react";
import { Label } from "~/components/forms";
import { useRouter } from "next/router";

type FormData = Record<"name" | "email" | "password", string>;

export default function Register () {
  const router = useRouter();
  const { status: authStatus } = useSession();

  const { status, mutate: register, isLoading, isSuccess, isError, ..._register } = api.auth.register.useMutation();
  const [formData, setFormData] = useState<FormData | object>({});

  useEffect(() => {
    if(isError) console.log({_register, status, isLoading, isError, isSuccess, formData});
    else if(isSuccess) signIn();
  }, [status]);

  if (authStatus == "authenticated") router.push("/");

  const handleRegister = () => {
    register(formData as FormData);
  };

  const handleChange = (ev: FormEvent<HTMLInputElement>) => {
    const target = ev.target as typeof ev.currentTarget;
    setFormData((val) => ({
      ...val,
      [target.name]: target.value,
    }));
  }

  
  return (
    <main>
      <div className="card bg-base-100 w-11/12 md:w-[32rem] mx-auto mt-24">
        <div className="card-body">
          
          <h2 className="card-title">Register</h2>
          {isError && <div className="alert alert-error">
            <XCircle />
            <span>Register Failed! Please check your input or open console for technical inspection.</span>
          </div>}

          <Label labelTopLeft="What is your name?">
            <input type="text" name="name" placeholder="Type here" onInput={handleChange}
              className="input input-bordered w-full" />
          </Label>
          <Label labelTopLeft="Register your Email.">
            <input type="email" name="email" placeholder="your@email.com" onInput={handleChange}
              className="input input-bordered w-full" />
          </Label>
          <Label labelTopLeft="Shhh... Keep your password secret.">
            <input type="password" name="password" placeholder="Password" onInput={handleChange}
              className="input input-bordered w-full" />
          </Label>

          <div className="card-actions justify-between mt-4">
            <button className="btn btn-ghost" onClick={() => void signIn()}>or try to login.</button>
            <button className="btn btn-primary" onClick={() => (!isLoading && handleRegister())}>
              Register
              {isLoading && <span className="loading loading-spinner text-neutral"></span>}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
