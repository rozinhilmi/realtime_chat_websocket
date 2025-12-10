import { Button, CloseButton, Dialog, HStack, IconButton, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export const ModalCreateRoomChats = ({
  createNewRoomChat,
  showModalCreateRoomChat,
  setShowModalCreateRoomChat,
}: {
  createNewRoomChat: (params: string) => void;
  showModalCreateRoomChat: boolean;
  setShowModalCreateRoomChat: (params: boolean) => void;
}) => {
  const [roomNameInput, setRoomNameInput] = useState<string>("");

  return (
    <Dialog.Root open={showModalCreateRoomChat} onOpenChange={(e) => setShowModalCreateRoomChat(e.open)}>
      <Dialog.Trigger asChild>
        <HStack justifyContent={"flex-end"}>
          <IconButton
            rounded={"full"}
            aria-label="create new room chat"
            colorPalette={"teal"}
            size="sm"
            bottom={"5px"}
            right={"5px"}
            position="relative"
          >
            <FaPlus />
          </IconButton>
        </HStack>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create New Room Chat</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Input placeholder="Room Name" value={roomNameInput} onChange={(e) => setRoomNameInput(e.target.value)} />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={() => {
                  createNewRoomChat(roomNameInput);
                }}
                colorPalette={"teal"}
                disabled={!roomNameInput}
              >
                Create
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
