import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Register () {
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  return (
    <main>
      <div className="card bg-base-100 w-11/12 md:w-[32rem] mx-auto mt-24">
        <div className="card-body">
          <h2 className="card-title">Register</h2>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">What is your name?</span>
            </label>
            <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Register your Email.</span>
            </label>
            <input type="email" name="email" placeholder="your@email.com" className="input input-bordered w-full" />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Shhh... Keep your password secret.</span>
            </label>
            <input type="password" name="password" placeholder="Password" className="input input-bordered w-full" />
          </div>
          <div className="card-actions justify-between mt-4">
            <button className="btn btn-ghost" onClick={() => signIn()}>or try to login.</button>
            <button className="btn btn-primary">Register</button>
          </div>
        </div>
      </div>
    </main>
  );
}
