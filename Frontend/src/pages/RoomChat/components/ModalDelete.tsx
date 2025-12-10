import { IconButton } from "@chakra-ui/react";
import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";

import { useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { ChatInterface } from "..";
export const ModalDelete = ({ data, deleteChat }: { data: ChatInterface; deleteChat: (params: number) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <IconButton aria-label="Send Message" colorPalette="red" size="xs" type="submit" variant={"outline"} onClick={() => setOpen(true)}>
          <BsTrash3 />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header></Dialog.Header>
            {/* <Dialog.Body>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </Dialog.Body> */}
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={() => {
                  deleteChat(data.id);
                  setOpen(false);
                }}
                colorPalette={"teal"}
              >
                Delete
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
