// Imports
// ========================================================
import Image from "next/image";
import { useModal } from "connectkit";
import { useSession } from "next-auth/react";

import { formatAddress } from "../utils/addressFormatter";
import Button from "./Button";

// Auth Component
// ========================================================
const AuthShowcase: React.FC = () => {
  // Wagmi Hooks
  const { setOpen } = useModal();
  const { data: session, status } = useSession();

  // Render
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-light">
      <div className="flex items-center justify-center text-center">
        {session && (
          <div className="mr-4 p-2">
            {formatAddress(JSON.stringify(session?.user.address, null, 2))}
          </div>
        )}
        <Button onClick={() => setOpen(true)}>
          {status != "authenticated" ? "Connect Wallet" : "Disconnect"}
        </Button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <>
      <nav className="navbar sticky top-0 z-50 border-b border-light bg-dark">
        <div className="navbar-start">
          <a href="/">
            <Image
              src="/logo-mrc.png"
              width={350}
              height={100}
              alt="Logo Mr.Crypto"
            />
          </a>
        </div>

        <div className="navbar-end mr-5">
          <AuthShowcase />
          <div className="dropdown-end dropdown ml-10">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="w-10 rounded-full ">
                <Image
                  src="/mrcrypto2.png"
                  alt="Profile Access"
                  width={40}
                  height={40}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-sm mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                {session && (
                  <a href={`/user/${session.user.address}`} className="text-lg">
                    Profile
                  </a>
                )}
              </li>
              <li>
                {!session && <p className="text-lg"> Connect your wallet </p>}
              </li>
            </ul>
          </div>
        </div>
        <div className="divider mb-0"></div>
      </nav>
    </>
  );
};

export default Navbar;
