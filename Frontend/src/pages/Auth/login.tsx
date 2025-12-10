import { toaster, Toaster } from "@/components/ui/toaster";
import { BASE_API } from "@/utils/constant/api";
import { setStore } from "@/utils/store/store";
import { Button, Input, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export const Login = () => {
  const [usernameInput, setUsernameInput] = useState<string>("");
  const navigate = useNavigate();
  const login = async (e: any) => {
    e.preventDefault();
    try {
      await axios
        .post(`${BASE_API}/login`, {
          username: usernameInput,
        })
        .then((res) => {
          setStore("token", res.data.username);
          navigate("/");
        })
        .catch((e) => {
          toaster.create({
            description: e.response.data.message,
            type: "error",
            closable: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Stack width={"100%"} alignItems={"center"} height={"100vh"} justifyContent={"center"}>
      <Stack
        width={"100%"}
        height={"100vh"}
        maxWidth={"600px"}
        justifyContent={"center"}
        alignItems={"center"}
        boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
        as="form"
        onSubmit={login}
      >
        <Stack gap={"0px"}>
          <Text>Username</Text>
          <Input borderColor={"teal"} value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
        </Stack>
        <Button colorPalette={"teal"} type="submit">
          Login
        </Button>
        <Toaster />
      </Stack>
    </Stack>
  );
};
