import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { signIn, useSession } from "next-auth/react";
import UserDropdown from "./navigation/UserDropdown";
import { Session } from "next-auth";
import Image from "next/image";
import logo from ".//../../public/vault.png";
import Link from "next/link";

interface NavigationProps {
  activeTab: string | null
  sessionData: Session | null
  sessionStatus: "authenticated" | "loading" | "unauthenticated"
}

const Nav: React.FC<NavigationProps> = ({ activeTab = null, sessionData = null, sessionStatus = "unauthenticated" }) => {

  console.log(sessionData?.user);

  return (
    <>
      <Navbar
      fluid={true}
      rounded={true}
      >
        <Navbar.Brand href="/">
          <Image
            src={logo}
            className="mr-3 h-6 w-6 sm:h-9 sm:w-9"
            alt="Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          ZKA Vault
          </span>
        </Navbar.Brand>
        
        <div className="md:flex md:items-center">
          {sessionStatus === "unauthenticated"
            ? <div className="flex md:order-2">
                <Button
                  onClick={() => void signIn()}
                >
                  Log In
                </Button>
                <Navbar.Toggle />
              </div>
            : sessionStatus === "loading"
            ? <div className="flex md:order-2">
                <Avatar rounded={true}/>
              </div>
            : <UserDropdown sessionData={sessionData}/>
          }
          
          <Navbar.Collapse className="md:mx-7">
            <Navbar.Link
              href="/"
              active={activeTab === "Home"}
              as={Link}
            >
              Home
            </Navbar.Link>
            <Navbar.Link 
              href="/vaults"
              active={activeTab === "Vault"}
              as={Link}
            >
              Vaults
            </Navbar.Link>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  )
}
export default Nav;