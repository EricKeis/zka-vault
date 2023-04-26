import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { signIn, useSession } from "next-auth/react";
import UserDropdown from "./navigation/UserDropdown";
import { Session } from "next-auth";

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
        <Navbar.Brand href="https://flowbite.com/">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          ZKA Vault
          </span>
        </Navbar.Brand>
        
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
        

        <Navbar.Collapse>
          <Navbar.Link
            href="/"
            active={activeTab === "Home"}
          >
            Home
          </Navbar.Link>
          <Navbar.Link 
            href="/vaults"
            active={activeTab === "Vault"}
          >
            Vault
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
export default Nav;