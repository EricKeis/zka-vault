import { NextPage } from "next";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";


const Vault: NextPage = () => {
  const router =  useRouter();
  const { vid } = router.query;

  const vault = api.vaults.getVaultById.useQuery({ id: vid as string})
  
  return (
    <>
      <Navbar />

      <p>{vault.data?.id}</p>
      <p>{vault.data?.data}</p>
    </>
  )
}

export default Vault;