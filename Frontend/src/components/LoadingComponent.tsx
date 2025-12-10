import { Button, Stack } from "@chakra-ui/react";
import { useStyle } from "./theme";

export const LoadingComponent = () => {
  const style = useStyle();
  return (
    <Stack
      borderRadius={style.borderRadius}
      backgroundColor={style.backgroundContainer}
      width={"100%"}
      height={"500px"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Button loading={true}></Button>
    </Stack>
  );
};
