import { SIWEProvider, type SIWEConfig } from "connectkit";
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useNetwork } from "wagmi";

export function AuthSIWEProvider({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const siweConfig: SIWEConfig = {
    getNonce: async () => {
      const nonce = await getCsrfToken();
      if (!nonce) throw new Error();
      return nonce;
    },

    createMessage: ({ nonce, address, chainId }) =>
      new SiweMessage({
        version: "1",
        domain: window.location.host,
        uri: window.location.origin,
        address,
        chainId,
        nonce,
        statement: "Sign in With Ethereum.",
      }).prepareMessage(),

    signOut: async () => {
      const response = await signOut({ redirect: false });
      return Boolean(response?.url);
    },

    verifyMessage: async ({ message, signature }) => {
      const response = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
      return response?.ok ?? false;
    },
    getSession: async () => {
      const session = await getSession();
      if (session?.user.address) {
        return {
          address: session.user.address,
          chainId: chain?.id ?? 0,
        };
      }
      return { address: "", chainId: 0 };
    },
    signOutOnAccountChange: true,
    signOutOnDisconnect: true,
    signOutOnNetworkChange: true,
  };

  return <SIWEProvider {...siweConfig}>{children}</SIWEProvider>;
}
