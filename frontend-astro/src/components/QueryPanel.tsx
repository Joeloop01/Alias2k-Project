import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";



export default function QueryPanel({ children }: PropsWithChildren) {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient} >
            {children}
        </QueryClientProvider>
    );
}