import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface NavigationProps {
  sessionData: Session | null
}

const UserDropdown: React.FC<NavigationProps> = ({ sessionData }) => {

  return (
    <div className="flex md:order-2">
      <Dropdown
        arrowIcon={false}
        inline={true}
        label={<Avatar alt="User settings"  bordered={true} color="gray" img={sessionData?.user.image as string} rounded={true}/>}
      >
        <Dropdown.Header>
          <span className="block text-sm">
            {sessionData?.user.name}
          </span>
          <span className="block truncate text-sm font-medium">
            {sessionData?.user.email}
          </span>
        </Dropdown.Header>
        <Dropdown.Item>
          Profile
        </Dropdown.Item>
        <Dropdown.Item>
          Account
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => void signOut()}>
          Sign out
        </Dropdown.Item>
      </Dropdown>
      <Navbar.Toggle />
    </div>
  )
}

export default UserDropdown;