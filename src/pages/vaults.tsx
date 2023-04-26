import { VaultData } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { z } from "zod";
import Nav from "~/components/Nav";
import { useForm } from 'react-hook-form';

import { api } from "~/utils/api";
import { useSession } from "next-auth/react";


const Vaults: NextPage = () => {
  const createVault = api.vaults.createVault.useMutation();
  const vaults = api.vaults.getAll.useQuery();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { data: sessionData, status: sessionStatus } = useSession();

  const onSubmit = (data: { vaultName: string, vaultPassword: string, vaultData: string }) => {
    try {
      const result = createVault.mutate({ ...data });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Nav 
        activeTab={"Vault"}
        sessionData={sessionData}
        sessionStatus={sessionStatus}
      />
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label 
            htmlFor="vaultName" 
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Vault Name</label>
          <input 
            type="vaultName" 
            id="vaultName" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="My Vault" 
            required
            maxLength={25}
            {...register("vaultName")}
          />
        </div>
        <div className="mb-6">
          <label 
            htmlFor="vaultPassword" 
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Vault password</label>
          <input 
            type="password" 
            id="vaultPassword" 
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            required
            {...register("vaultPassword")}
          />
        </div>
        <div className="mb-6">
          <label 
            htmlFor="message" 
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Vault data</label>
          <textarea 
            id="message" 
            rows={4} 
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="Store your secure information here"
            required
            {...register("vaultData")}
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >Create Vault</button>
      </form>

      <h1 className="mt-10">Saved Vaults</h1>

      {vaults.data?.map(v => (
        <div key={v.id}>
          <Link href={`/vault/${v.id}`}>{v.name}</Link>
        </div>
      ))}
    </>
  )
}

export default Vaults;