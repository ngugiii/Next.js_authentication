"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { FaUserCircle } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";


const Navbar = () => {
  const [openUserPopup, setOpenUserPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
//   const links = [];
  const [userName, setUserName] = useState("");
  const router=useRouter();
  const currentPath = usePathname();

  const {data: session}=useSession();

  const userRole=session?.role;

  console.log(session);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  

//   if (session && userRole === "admin" && !isMobile) {
//     links.push(
//       { id: 1, href: "/dashboard", name: "Dashboard" },
//       { id: 2, href: "/issues", name: "Issues" }
//     );
//   }

const links=[
    { id: 1, href: "/posts", name: "Posts" },
    // { id: 2, href: "/issues", name: "Issues" }
]


  const handlePopup = () => {
    setOpenUserPopup(!openUserPopup);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    setOpenUserPopup(false);
    setUserName("")
    toast.success("User Logged out");
    sessionStorage.clear();
  };

  return (
    <nav className="flex justify-between border-b mb-5 px-5 md:px-16 h-14 items-center">
      <Link href="/" className="flex items-center text-3xl">
        <span className="text-purple-700 flex items-center">Jobs</span><span className="font-bold flex items-center">Hub</span>
      </Link>
      <div className="flex space-x-6 items-center">
        <ul className="flex space-x-6">
          {/* {links.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                className={classNames({
                  "text-purple-600": link.href === currentPath,
                  "text-zinc-500": link.href !== currentPath,
                  "hover:text-zinc-800 transition-colors text-lg": true,
                })}
              >
                {link.name}
              </Link>
            </li>
          ))} */}
         {!session && <li onClick={()=>signIn()} className="bg-purple-700 hover:bg-purple-800 text-lg text-white rounded-md px-2 py-1 cursor-pointer">Login</li>} 
        </ul>
        {session && <FaUserCircle
          size={28}
          className="cursor-pointer"
          onClick={handlePopup}
        />}
        {openUserPopup && (
          <div className="absolute rounded border-2 p-2 top-[3.6rem] right-[1rem] flex flex-col bg-gray-100">
            <Link href={"/profile"} className="mb-2">Profile</Link>
            {/* {isMobile && userRole==="admin" && (
              <>
                <Link className="mb-1 hover:text-[orangered]" href="/dashboard">
                  Dashboard
                </Link>
                <Link className="mb-2 hover:text-[orangered]" href="/issues">
                  Issues
                </Link>
              </>
            )} */}
            <button className="bg-[orangered] hover:bg-red-600 flex justify-center items-center text-white rounded px-2 py-1" onClick={handleLogout}>
          <FiLogOut color="white" size={20} className="mr-2"/>Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
