import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Nav from "~/components/Nav";
import { Button } from "flowbite-react";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: sessionData, status: sessionStatus } = useSession();

  return (
    <>
      <Head>
        <title>ZKA Vault</title>
        <meta name="description" content="ZKA Vault" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#D4DEFF] to-[#022BB7]">
      <Nav 
        activeTab={"Home"}
        sessionData={sessionData}
        sessionStatus={sessionStatus}
      />
        
          <h1 className="mt-5 text-5xl font-extrabold text-white sm:text">
            Zero Knowledge Architecture <span className="text-[hsl(215,100%,40%)]">Vault</span>
          </h1>
        
        <p className="text-center text-sky-800 w-3/4 mt-10">Our Zero Knowledge Architecture Vault incorporates AES256-GCM encryption to ensure the utmost security of your sensitive information. By employing a strict "no knowledge" approach, only you hold the key to access your encrypted data, guaranteeing complete privacy. This cutting-edge vault provides industry-leading protection, safeguarding your data from unauthorized access and maintaining the confidentiality of your information.</p>
        

        {/* div for the github buttons*/}
        <div className="mb-5 mt-auto flex flex-wrap items-center justify-center gap-1">
            
                <Button
                  outline={true}
                  gradientDuoTone="greenToBlue"
                > 
                  <Link
                    href="https://github.com/EricKeis"
                    target="_blank"
                  > 
                <h3 className="text-2x2 font-bold i">Eric Keis GitHub</h3>
                    </Link>
                </Button>
              
            
                <Button
                  outline={true}
                  gradientDuoTone="greenToBlue"
                > 
                  <Link
                    href="https://github.com/bfrazzin"
                    target="_blank"
                  > 
                <h3 className="text-2x2 font-bold i">Blake Frazzini GitHub</h3>
                    </Link>
                </Button>
              
          </div>
        
        
            
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Log out" : "Log in"}
      </button>
    </div>
  );
};
