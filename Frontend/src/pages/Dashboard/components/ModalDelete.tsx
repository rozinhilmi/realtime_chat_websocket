import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
export const ModalDelete = ({
  deleteRoomChat,
  showModalRemoveChat,
  setShowMoRemoveChat,
}: {
  deleteRoomChat: (params: string) => void;
  showModalRemoveChat: string;
  setShowMoRemoveChat: (params: string) => void;
}) => {
  const closeModal = () => {
    setShowMoRemoveChat("");
  };
  return (
    <Dialog.Root open={showModalRemoveChat ? true : false}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body></Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                onClick={() => {
                  deleteRoomChat(showModalRemoveChat);
                }}
                colorPalette={"teal"}
              >
                Delete
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={closeModal} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
