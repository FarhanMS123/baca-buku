import Link from "next/link";
import { ReactNode } from "react";

export default function Dashboard ({ children }: {
  children: ReactNode
}) {
  return <>
    <div className="drawer drawer-open">
      <input type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="bg-base-100 m-4 p-4 w-100 rounded-box">
          { children }
        </div>
      </div> 
      <div className="drawer-side">
        <ul className="menu m-4 p-4 w-80 rounded-box bg-base-100 text-base-content">
          <li><Link href="/dashboard">Profile</Link></li>
          <div className="divider divider-vertical m-0"></div>
          <li><Link href="/dashboard/audio-management">Audio Management</Link></li>
          <li><Link href="/dashboard/story-management">Story Management</Link></li>
        </ul>
      </div>
    </div>
  </>;
}
