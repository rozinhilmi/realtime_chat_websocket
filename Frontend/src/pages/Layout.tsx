import { Toaster } from "@/components/ui/toaster";
import { Stack } from "@chakra-ui/react";
import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <Stack width="100%" alignItems="center" height="100vh" justifyContent="center">
      <Stack
        maxWidth="600px"
        position="relative"
        height="90%"
        overflowY="hidden"
        display="flex"
        flexDirection="column"
        boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
        width={"100%"}
      >
        <Outlet />
        <Toaster />
      </Stack>
    </Stack>
  );
};
