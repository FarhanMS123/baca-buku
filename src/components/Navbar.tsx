import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import logo2 from "~/assets/logo-2.png"

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <div className="w-16">
          <Image src={logo2} alt="Baca Buku" />
        </div>
        <Link href="/" className="btn btn-ghost ml-2">Home</Link>
      </div>
      <div className="flex-none flex gap-2">
        {!session && <>
          <button className="btn btn-primary" onClick={() => void signIn()}>Login</button>
          <Link href="/register" className="btn">Register</Link>
        </>}
      </div>
    </div>
  );
}
