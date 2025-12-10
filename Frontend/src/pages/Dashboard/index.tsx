import { helper } from "@/utils/helper";
import { store } from "@/utils/store/store";
import { HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { NavLink } from "react-router";
import { io } from "socket.io-client";
import { ModalCreateRoomChats } from "./components/ModalCreateRoomChats";
import { ModalDelete } from "./components/ModalDelete";
import { BsTrash3 } from "react-icons/bs";
import { BASE_API } from "@/utils/constant/api";

export interface RoomChatsInterface {
  id: string;
  name: string;
}

// pr berikutnya adalah menambahkan loading socket ketika disconect
export const Index = () => {
  const token = store("token");
  const roomId = "list_room_chat";
  const socket = useMemo(
    () =>
      io(BASE_API, {
        query: {
          token: token,
        },
        autoConnect: true,
        reconnectionAttempts: 20,
        reconnectionDelay: 10000,
      }),
    []
  );
  const [listRoomChats, setListRoomChat] = useState<RoomChatsInterface[]>([]);
  const [showModalCreateRoomChat, setShowModalCreateRoomChat] = useState<boolean>(false);
  const [showModalRemoveChat, setShowMoRemoveChat] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      // console.log("Socket connected (or reconnected). List Room Chats...");
      socket.emit(roomId, { username: token });
    });
    const onGetListRoomChat = (data: RoomChatsInterface[]) => {
      // console.log("receive List Room Chat");
      setListRoomChat(data);
    };
    const onGetNewRoomChat = (data: RoomChatsInterface) => {
      setListRoomChat((prev) => [data, ...prev]);
    };
    const onRemoveRoomChat = (data: { id: string; name: string }) => {
      setListRoomChat((prev) => prev.filter((i) => !(i.id == data.id)));
      setShowMoRemoveChat("");
    };

    socket.on("get_list_room_chat", onGetListRoomChat);
    socket.on("get_new_room_chat", onGetNewRoomChat);
    socket.on("remove_room_chat", onRemoveRoomChat);

    return () => {
      socket.off("get_list_room_chat", onGetListRoomChat);
      socket.off("get_new_room_chat", onGetNewRoomChat);
      socket.off("remove_room_chat", onRemoveRoomChat);
      socket.off("connect");
      socket.disconnect();
    };
  }, [socket, roomId, token]);

  const createNewRoomChat = (roomName: string) => {
    socket.emit("create_room_chat", {
      username: token,
      roomName: roomName,
    });
    setShowModalCreateRoomChat(false);
  };

  const deleteRoomChat = (id: string) => {
    socket.emit("delete_room_chat", {
      id: id,
    });
  };
  return (
    <Stack position={"relative"} height={"100%"}>
      <HStack justifyContent="space-between" boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px" paddingX="10px" position="relative">
        <Text as="b">{token}</Text>
        <IconButton aria-label="Logout" colorPalette={"red"} size="sm" onClick={helper.logout} variant="outline">
          <LuLogOut />
        </IconButton>
      </HStack>

      <Stack flexGrow={1} padding={"5px"} gap={"10px"} overflowY="scroll">
        {listRoomChats.map((i: RoomChatsInterface) => (
          <HStack width={"100%"} justifyContent={"space-between"}>
            <NavLink to={`room-chat/${i.id}`}>
              <Stack width={"100%"} padding={"10px"} boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px">
                <Text>{i.name}</Text>
              </Stack>
            </NavLink>
            <IconButton
              aria-label="Send Message"
              colorPalette="red"
              size="xs"
              type="submit"
              variant={"outline"}
              onClick={() => setShowMoRemoveChat(i.id)}
            >
              <BsTrash3 />
            </IconButton>
          </HStack>
        ))}
      </Stack>
      <ModalCreateRoomChats
        createNewRoomChat={createNewRoomChat}
        showModalCreateRoomChat={showModalCreateRoomChat}
        setShowModalCreateRoomChat={setShowModalCreateRoomChat}
      />
      {showModalRemoveChat ? (
        <ModalDelete deleteRoomChat={deleteRoomChat} showModalRemoveChat={showModalRemoveChat} setShowMoRemoveChat={setShowMoRemoveChat} />
      ) : null}
    </Stack>
  );
};
