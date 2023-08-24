import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc.ts";
import { httpBatchLink } from "@trpc/client";
import { getAuthToken } from "./common/utils.ts";
import { UserContext } from "./common/useUserContext.ts";
import { IUser } from "./common/types.ts";

function Main() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
          //@ts-expect-error error
          async headers() {
            const token = getAuthToken();
            if (token) {
              return {
                authorization: `Bearer ${token}`,
              };
            }
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <UserDataProvider />
        </ChakraProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function UserDataProvider() {
  const { data } = trpc.authRouter.getUser.useQuery();
  const [userData, setUserData] = useState<IUser | null>(null);

  useEffect(() => {
    data && setUserData(data);
  }, [data]);

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
