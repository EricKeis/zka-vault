import { VaultData } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { z } from "zod";
import Nav from "~/components/Nav";
import { useForm } from 'react-hook-form';

import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Table } from "flowbite-react";
import { hashPassword } from "~/utils/cryptoUtils";

const Vaults: NextPage = () => {
  const createVault = api.vaults.createVault.useMutation({onSuccess: () => vaults.refetch()});
  const vaults = api.vaults.getAll.useQuery();
  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm();
  const { data: sessionData, status: sessionStatus } = useSession();

  const onSubmit = (data: { vaultName: string, vaultPassword: string, vaultData: string }) => {
    try {
      const result = createVault.mutate({ ...data });
      console.log(data);
      sessionStatus === "authenticated" ? console.log(hashPassword(data.vaultPassword, sessionData?.user.id)) : null;

      resetForm();
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
      
      <h1 className="text-center my-5 font-semibold">Saved Vaults</h1>
      <div className="flex justify-center">
        <div className="mb-9 px-3 w-full md:w-1/2">
          <Table striped={true}>
            <Table.Head>
              <Table.HeadCell>
                Vault Name
              </Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">
                  Edit
                </span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {vaults.data?.map(v => (
                <Table.Row key={v.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {v.name}
                  </Table.Cell>
                  <Table.Cell>
                    <Link 
                      href={`/vault/${v.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      View
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <form onSubmit={handleSubmit(onSubmit)} className="px-3 w-full md:w-1/2">
          <div className="mb-3">
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
          <div className="mb-3">
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
          <div className="mb-3">
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
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >Create Vault</button>
        </form>
      </div>
    </>
  )
}

export default Vaults;