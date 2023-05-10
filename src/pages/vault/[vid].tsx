import { NextPage } from "next";
import { useRouter } from "next/router";
import Nav from "~/components/Nav";
import { api } from "~/utils/api";
import { SubmitHandler, useForm } from 'react-hook-form';
import { decryptData, getPasswordHash } from "~/utils/client/cryptoUtils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Card, TextInput } from "flowbite-react";

type FormValues = {
  password: string;
};

const Vault: NextPage = () => {
  const router =  useRouter();
  const { register, handleSubmit, getValues , formState: { errors } } = useForm<FormValues>();
  const { data: sessionData, status: sessionStatus } = useSession();
  const { vid } = router.query;
  const [decryptedData, setDecryptedData] = useState("");
  

  const vault = api.vaults.getVaultById.useQuery(
    { id: vid as string },
    { enabled: vid !== undefined },
  );
  const vaultData = api.vaults.getVaultData.useMutation({
    onSuccess: async (data, variables, context) => {
      setDecryptedData(await decryptData(data.aes256Iv, getValues("password"), data.aes256KeySalt, data.data));
    }
  });
  
  
  const onSubmit: SubmitHandler<FormValues> = async (data: { password: string }) => {
    try {
      const passwordHash = await getPasswordHash(data.password, sessionData?.user.id as string)
      const v = vaultData.mutate({ id: vid as string, passwordClientSideHash: passwordHash });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Nav 
        activeTab={null}
        sessionData={sessionData}
        sessionStatus={sessionStatus}
      />
      <h1 className="flex justify-center text-xl">{vault.data?.name}</h1>

      {vaultData.isSuccess 
        ?
          <Card className="w-1/2 mt-5 mx-auto">
            <p className="whitespace-pre-wrap">{decryptedData}</p>
          </Card>
        :
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="items-center flex flex-col justify-center mt-5"
          >
            <div>
              <input 
                type="password" 
                id="vaultPassword" 
                placeholder="Vault password"
                className="bg-gray-50 h-8 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-2" 
                required
                {...register("password")}
              />
              <button 
                type="submit" 
                className="text-white h-8 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm w-full sm:w-auto px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Unlock Vault
              </button>
            </div>
          </form>
      }
      
    </>
  )
}

export default Vault;