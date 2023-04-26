import { NextPage } from "next";
import { useRouter } from "next/router";
import Nav from "~/components/Nav";
import { api } from "~/utils/api";
import { useForm } from 'react-hook-form';

const Vault: NextPage = () => {
  const router =  useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { vid } = router.query;
  

  const vault = api.vaults.getVaultById.useQuery(
    { id: vid as string },
    { enabled: vid !== undefined },
  );
  const vaultData = api.vaults.getVaultData.useMutation();
  
  
  const onSubmit = (data: { password: string }) => {
    try {
      const result = vaultData.mutate({ id: vid as string, ...data });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Nav />
      <p>{vault.data?.name}</p>

      {vaultData.isSuccess 
        ?
          <p className="whitespace-pre-wrap">{vaultData.data.data}</p>
        :
          <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("password")}
              />
            </div>
            <button 
              type="submit" 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >Unlock Vault</button>
          </form>
      }
      
    </>
  )
}

export default Vault;