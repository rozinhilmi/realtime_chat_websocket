import { helper } from "@/utils/helper";
import { store } from "@/utils/store/store";
import { HStack, IconButton, Input, SkeletonText, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { IoArrowBack, IoSend } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import io from "socket.io-client";
import { ModalDelete } from "./components/ModalDelete";
import { toaster } from "@/components/ui/toaster";
import { BASE_API } from "@/utils/constant/api";

// Socket.io client instance

export interface ChatInterface {
  roomId: string | undefined;
  id: number;
  socketId: string;
  username: string;
  message: string;
  status: string;
}
export interface RoomCHatsInterface {
  name: string;
  chats: ChatInterface[];
}

export const Index = () => {
  const { roomId } = useParams();
  const token = store("token");
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
  const [messageInput, setMessageInput] = useState<string>("");
  const [roomChats, setRoomChats] = useState<RoomCHatsInterface>({
    name: "init",
    chats: [],
  });

  const navigate = useNavigate();
  const bottomChatRef = useRef<HTMLDivElement | null>(null);
  const navigateBack = () => {
    navigate(-1);
  };

  // SETUP LISTENER SEKALI SAJA
  useEffect(() => {
    // LISTEN CONNECT → REJOIN ROOM
    socket.on("connect", () => {
      console.log("Socket connected (or reconnected). Joining room...");
      socket.emit("room_chat", { roomId: roomId, username: token });
    });

    const onGetAllChat = (data: RoomCHatsInterface) => {
      setRoomChats(data);
      // setChats(history);
    };

    const onReceiveMessage = (res: ChatInterface) => {
      setRoomChats((prev) => ({ ...prev, chats: [...prev.chats, res] }));
      // setChats((prev) => [...prev, res]);
    };

    const onClientReceiveStopType = (res: { username: string }) => {
      setRoomChats((prev) => ({ ...prev, chats: prev.chats.filter((i) => !(i.username === res.username && i.status === "typing")) }));
      // setChats((prev) => prev.filter((i) => !(i.username === res.username && i.status === "typing")));
    };

    const onRemoveChat = (res: { id: number }) => {
      setRoomChats((prev) => ({ ...prev, chats: prev.chats.filter((i) => !(res.id === i.id)) }));
      // setChats((prev) => prev.filter((i) => !(res.id === i.id)));
    };

    const onRoomChatSessionOff = () => {
      navigateBack();
      toaster.create({
        description: `Session has been ended`,
        type: "warning",
        closable: true,
      });
    };

    socket.on("get_all_chat", onGetAllChat);
    socket.on("receive_message", onReceiveMessage);
    socket.on("clientReceiveStopType", onClientReceiveStopType);
    socket.on("remove_chat", onRemoveChat);
    socket.on("navigate_list_room_chat", onRoomChatSessionOff);

    return () => {
      socket.off("get_all_chat", onGetAllChat);
      socket.off("receive_message", onReceiveMessage);
      socket.off("clientReceiveStopType", onClientReceiveStopType);
      socket.off("remove_chat", onRemoveChat);
      socket.off("navigate_list_room_chat", navigateBack);
      socket.off("connect");
      socket.disconnect();
    };
  }, [socket, roomId, token]);

  // Handle sending message
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (messageInput.trim()) {
      socket.emit("clientStopType", {
        roomId: roomId,
        username: token,
      });
      socket.emit("send_message", {
        roomId: roomId,
        username: token,
        message: messageInput,
        status: "message",
      });
      setMessageInput("");
    }
  };

  const deleteAllChat = () => {
    socket.emit("delete_all_chat", {
      roomId: roomId,
    });
  };
  const deleteChat = (id: number) => {
    socket.emit("delete_spesific_chat", {
      roomId: roomId,
      id: id,
    });
    socket.emit("clientStopType", {
      roomId: roomId,
      username: token,
    });
  };

  const typingTimeoutRef = useRef<number | null>(null);
  const stopTypingTimeoutRef = useRef<number | null>(null);
  const [isTypingSent, setIsTypingSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    // ---- kirim typing sekali saja ----
    if (!isTypingSent && value.trim() !== "") {
      socket.emit("clientTyping", { roomId: roomId, username: token, message: "", status: "typing" });
      setIsTypingSent(true);
    }

    // ---- bersihkan timeout sebelumnya ----
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (stopTypingTimeoutRef.current) clearTimeout(stopTypingTimeoutRef.current);

    // ---- timeout stop typing ----
    stopTypingTimeoutRef.current = window.setTimeout(() => {
      socket.emit("clientStopType", { roomId: roomId, username: token });
      setIsTypingSent(false);
    }, 2500); // atau 3500 sesuai kebutuhan
  };

  useEffect(() => {
    bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomChats.chats]);

  return (
    <Stack height={"100%"}>
      <HStack justifyContent="space-between" boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px" paddingX="10px" paddingY={"5px"} position="relative">
        <HStack>
          <IconButton onClick={navigateBack} aria-label="back button" colorPalette={"teal"} size="sm" variant={"outline"}>
            <IoArrowBack />
          </IconButton>
          <Text as="b">
            {roomChats.name} ({token})
          </Text>
        </HStack>

        <IconButton aria-label="Logout" colorPalette={"red"} size="sm" onClick={helper.logout} variant="outline">
          <LuLogOut />
        </IconButton>
      </HStack>
      <Stack flexGrow={1} overflowY="scroll" paddingX="10px" gap={"10px"}>
        {/* <pre>{JSON.stringify(roomChats, null, 2)}</pre> */}
        {roomChats.chats.map(({ id, socketId, username, message, status }, index) =>
          !(username === token && status == "typing") ? (
            <HStack justifyContent={username === token ? "end" : "start"} key={index}>
              <Stack
                gap="0"
                textAlign={username === token ? "end" : "start"}
                paddingY={"4px"}
                paddingX={"20px"}
                boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px"
              >
                <HStack justifyContent={"space-between"}>
                  <Text as="b">{username}</Text>
                  {username === token ? <ModalDelete data={{ roomId, id, socketId, username, message, status }} deleteChat={deleteChat} /> : null}
                </HStack>

                {status == "typing" ? <SkeletonText noOfLines={1} /> : <Text>{message}</Text>}
              </Stack>
            </HStack>
          ) : null
        )}
        <div ref={bottomChatRef}></div>
      </Stack>
      {/* Message Input and Send Button */}

      <HStack
        position="relative"
        bottom="5px"
        paddingX="10px"
        width="100%"
        backgroundColor="white"
        alignItems="flex-end"
        onSubmit={handleSendMessage}
        as={"form"}
      >
        <Input value={messageInput} onChange={handleInputChange} placeholder="Type a message" borderColor="teal" />
        <Stack>
          <IconButton aria-label="Delete Chat" rounded="full" colorPalette={"red"} size="sm" onClick={deleteAllChat} variant={"subtle"}>
            <BsTrash3 />
          </IconButton>

          <IconButton aria-label="Send Message" rounded="full" colorPalette="teal" size="sm" type="submit" variant={"subtle"}>
            <IoSend />
          </IconButton>
        </Stack>
      </HStack>
    </Stack>
  );
};
