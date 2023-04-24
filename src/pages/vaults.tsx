import { VaultData } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Navbar from "~/components/Navbar";

import { api } from "~/utils/api";

const Vaults: NextPage = () => {
  const createVault = api.vaults.createVault.useMutation();
  const vaults = api.vaults.getAll.useQuery();

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4">
        <button type="button" onClick={() => {createVault.mutate()}} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Create new vault</button>
      </div>
      <p>{createVault.isSuccess ? createVault.data.id : "failed to create vault"}</p>

      {vaults.data?.map(v => (
        <div key={v.id}>
          <Link href={`/vault/${v.id}`}>{v.id}</Link>
        </div>
      ))}

      
      <form>
        <div className="mb-6">
          <label htmlFor="vaultName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vault Name</label>
          <input 
            type="vaultName" 
            id="vaultName" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="My Vault" 
            required
            maxLength={25}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="vaultPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vault password</label>
          <input type="password" id="vaultPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Vault</button>
      </form>
    </>
  )
}

export default Vaults;