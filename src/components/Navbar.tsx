import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import logo2 from "~/assets/logo-2.png";
import { MoreHorizontal } from "lucide-react";

export default function NavBar() {
  
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="w-16">
          <Image src={logo2} alt="Baca Buku" />
        </div>
        <Link href="/" className="btn btn-ghost ml-2 hidden md:flex">Home</Link>
      </div>
      <MenuMd />
      <MenuMobile />
    </div>
  );
}

function MenuMd() {
  const { data: session } = useSession();

  return <div className="navbar-end gap-2 hidden md:flex">
  {!session && <>
    <Link href="/dashboard/setting" className="btn btn-ghost">Setting</Link>
    <button className="btn btn-primary" onClick={() => void signIn()}>Login</button>
    <Link href="/register" className="btn">Register</Link>
  </>}
  {session && <>
    <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
    <button className="btn btn-ghost" onClick={() => void signOut()}>Signout</button>
  </>}
</div>
}

function MenuMobile() {
  const { data: session } = useSession();

  return <div className="navbar-end md:hidden">
    <details className="dropdown dropdown-end">
      <summary className="btn btn-ghost"><MoreHorizontal /></summary>
      <ul className="shadow-xl menu dropdown-content bg-base-100 border z-[1]">
        <li><Link href="/">Home</Link></li>
        {!session && <>
          <li><Link href="/dashboard/setting">Setting</Link></li>
          <div className="divider divider-vertical m-0"></div>
          <li><a href="#"  onClick={() => void signIn()}>Login</a></li>
          <li><Link href="/register" className="btn content-center">Register</Link></li>
        </>}
        {session && <>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <div className="divider divider-vertical m-0"></div>
          <li><a href="#" onClick={() => void signOut()}>Signout</a></li>
        </>}
          <div className="divider divider-vertical m-0"></div>
          <li><Link href="/credit">Credit</Link></li>
      </ul>
    </details>
  </div>
}
