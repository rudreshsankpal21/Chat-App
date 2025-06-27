import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  Icon,
  Avatar,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { FiSend, FiInfo, FiMessageCircle } from "react-icons/fi";
import UsersList from "./UsersList";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { set } from "mongoose";

const ChatArea = ({ selectedGroup, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set()); // used to create a set object which is a collection of unique values & can store any type of values
  const messagesEndRef = useRef(null); // scroll to the bottom of the chat area
  const typingTimeoutRef = useRef(null);
  const toast = useToast();

  const currentUser = JSON.parse(localStorage.getItem("userInfo") || {});

  useEffect(() => {
    if (selectedGroup && socket) {
      // fetch messages
      fetchMessages();

      socket.emit("join room", selectedGroup._id); // join room

      // Message received
      socket.on("message received", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      // Users in room
      socket.on("users in room", (user) => {
        setConnectedUsers(user);
      });

      // Users left
      socket.on("users left", (user) => {
        setConnectedUsers((prev) => prev.filter((u) => u?._id !== user));
      });

      // Notification
      socket.on("notification", (notification) => {
        toast({
          title:
            notification.type === "USER_JOINED" ? "User joined" : "User left",
          description: notification.message,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });

      socket.on("user typing", ({ username }) => {
        setTypingUsers((prev) => new Set(prev).add(username));
      });

      // User stop typing
      socket.on("user stop typing", ({ username }) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(username);
          return newSet;
        });
      });

      // Clean up
      return () => {
        socket.emit("leave room", selectedGroup._id); // leave room
        socket.off("message received");
        socket.off("users in room");
        socket.off("users left");
        socket.off("notification");
        socket.off("user typing");
        socket.off("user stop typing");
      };
    }
  }, [selectedGroup, socket, toast]);

  // fetch messages
  const fetchMessages = async () => {
    const currentUser = JSON.parse(localStorage.getItem("userInfo") || {});

    const token = currentUser.user.token;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/messages/${selectedGroup._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(data);

      // setMessages(data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  // send message
  const sendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }
    try {
      const token = currentUser.user.token;

      const { data } = await axios.post(
        "http://localhost:5000/api/messages",
        {
          content: newMessage,
          groupId: selectedGroup?._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      socket.emit("new message", {
        ...data,
        groupId: selectedGroup?._id,
      });
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping && selectedGroup) {
      setIsTyping(true);
      socket.emit("typing", {
        groupId: selectedGroup?._id,
        username: currentUser?.user?.username,
      });
    }

    // clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedGroup) {
        socket.emit("stop typing", {
          groupId: selectedGroup?._id,
        });
      }
      setIsTyping(false);
    }, 1500);
  };

  // format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  // render typing indicator

  const sampleMessages = [];

  return (
    <Flex h="100%" position="relative">
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        bg="gray.50"
        maxW={`calc(100% - 260px)`}
      >
        {/* Chat Header */}
        <Flex
          px={6}
          py={4}
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.200"
          align="center"
          boxShadow="sm"
        >
          <Icon as={FiMessageCircle} fontSize="24px" color="blue.500" mr={3} />
          <Box flex="1">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Team Chat
            </Text>
            <Text fontSize="sm" color="gray.500">
              General Discussion
            </Text>
          </Box>
          <Icon
            as={FiInfo}
            fontSize="20px"
            color="gray.400"
            cursor="pointer"
            _hover={{ color: "blue.500" }}
          />
        </Flex>

        {/* Messages Area */}
        <VStack
          flex="1"
          overflowY="auto"
          spacing={4}
          align="stretch"
          px={6}
          py={4}
          position="relative"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              width: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.200",
              borderRadius: "24px",
            },
          }}
        >
          {sampleMessages.map((message) => (
            <Box
              key={message.id}
              alignSelf={message.isCurrentUser ? "flex-start" : "flex-end"}
              maxW="70%"
            >
              <Flex direction="column" gap={1}>
                <Flex
                  align="center"
                  mb={1}
                  justifyContent={
                    message.isCurrentUser ? "flex-start" : "flex-end"
                  }
                  gap={2}
                >
                  {message.isCurrentUser ? (
                    <>
                      <Avatar size="xs" name={message.sender.username} />
                      <Text fontSize="xs" color="gray.500">
                        You • {message.createdAt}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text fontSize="xs" color="gray.500">
                        {message.sender.username} • {message.createdAt}
                      </Text>
                      <Avatar size="xs" name={message.sender.username} />
                    </>
                  )}
                </Flex>

                <Box
                  bg={message.isCurrentUser ? "blue.500" : "white"}
                  color={message.isCurrentUser ? "white" : "gray.800"}
                  p={3}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Text>{message.content}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>

        {/* Message Input */}
        <Box
          p={4}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
          position="relative"
          zIndex="1"
        >
          <InputGroup size="lg">
            <Input
              placeholder="Type your message..."
              pr="4.5rem"
              bg="gray.50"
              border="none"
              _focus={{
                boxShadow: "none",
                bg: "gray.100",
              }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                colorScheme="blue"
                borderRadius="full"
                _hover={{
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s"
              >
                <Icon as={FiSend} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>

      {/* UsersList with fixed width */}
      <Box
        width="260px"
        position="sticky"
        right={0}
        top={0}
        height="100%"
        flexShrink={0}
      >
        {selectedGroup && <UsersList users={connectedUsers} />}
      </Box>
    </Flex>
  );
};

export default ChatArea;
