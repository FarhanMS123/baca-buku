import { signIn } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { XCircle } from "lucide-react";

type FormData = Record<"name" | "email" | "password", string>;

export default function Register () {
  const { status, mutate: register, isLoading, isSuccess, isError, ..._register } = api.auth.register.useMutation();
  const [formData, setFormData] = useState<FormData | object>({});

  useEffect(() => {
    if(isError) console.log({_register, status, isLoading, isError, isSuccess, formData});
    else if(isSuccess) signIn();
  }, [status]);

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
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">What is your name?</span>
            </label>
            <input type="text" name="name" placeholder="Type here" onInput={handleChange}
              className="input input-bordered w-full" />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Register your Email.</span>
            </label>
            <input type="email" name="email" placeholder="your@email.com" onInput={handleChange}
              className="input input-bordered w-full" />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Shhh... Keep your password secret.</span>
            </label>
            <input type="password" name="password" placeholder="Password" onInput={handleChange}
              className="input input-bordered w-full" />
          </div>
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
