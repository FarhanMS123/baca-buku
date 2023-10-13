import { PanelLeftOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ReactNode } from "react";

export default function Dashboard ({ children }: {
  children: ReactNode
}) {
  const { data: session } = useSession();
  return (
    <div className="drawer md:drawer-open w-full">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content min-w-0">
        <div className="bg-base-100 m-4 ml-2 p-4 w-100 rounded-box md:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-circle drawer-button">
            <PanelLeftOpen />
          </label>
        </div>
        <div className="bg-base-100 m-4 ml-2 p-4 w-100 rounded-box">
          { children }
        </div>
      </div> 
      <div className="drawer-side md:h-auto z-[1]">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 bg-base-100 text-base-content min-h-full md:min-h-0 md:m-4 md:mr-2 md:w-80 md:rounded-box">
          {session && <li><Link href="/dashboard">Profile</Link></li>}
          <li><Link href="/dashboard/setting">Setting</Link></li>
          {session && session.user.isAdmin && <>
            <div className="divider divider-vertical m-0"></div>
            {/* <li><Link href="/debug/blob">DEBUG: Vercel Blob</Link></li> */}
            <li><Link href="/dashboard/audio-management">Audio Management</Link></li>
            <li><Link href="/dashboard/story-management">Story Management</Link></li>
          </>}
          <div className="divider divider-vertical m-0"></div>
          <li><Link href="/credit">Credit</Link></li>
        </ul>
      </div>
    </div>
  );
}
