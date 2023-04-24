import { NextPage } from "next";
import Navbar from "~/components/Navbar";

import { api } from "~/utils/api";

const Vault: NextPage = () => {
  const vault = api.vaults.createVault.useMutation();

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4">
        <button type="button" onClick={() => {vault.mutate()}} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Create new vault</button>
      </div>
      <p>{vault.isSuccess ? vault.data.test : "no data"}</p>
    </>
  )
}

export default Vault;