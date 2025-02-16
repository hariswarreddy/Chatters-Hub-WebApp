import { useEffect, useRef, useState } from "react";
import { app } from "./firebase";
import {
  Box,
  Container,
  VStack,
  Button,
  Input,
  HStack,
  Text
} from "@chakra-ui/react";
import Message from "./components/Message";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logoutHandler = () => {
  signOut(auth);
};

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      divForScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });
    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);
  return (
    <Box bg={"red.50"}>
      {user ? (
        <>
        <Text h="2vh" justifyContent="center" px="2" fontWeight={700}>Created By :Bontha Hariswar Reddy </Text>
        <Container h={"98vh"} bg={"white"}>
          <VStack h={"full"} py={"4"} >
            <Button onClick={logoutHandler} w={"full"} colorScheme={"red"}>
              LOGOUT
            </Button>
            <VStack
              w={"full"}
              h={"full"}
              overflowY={"auto"}
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                />
              ))}
              <div ref={divForScroll}></div>
            </VStack>
            <form action={postMessage} onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a Message"
                />
                <Button type="submit" bg="purple.300" colorScheme={"white"}>
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
          
        </Container>
        </>
      ) : (
        <>
        <Text px="2" bg="white" fontWeight={700}>Created By :Bontha Hariswar Reddy </Text>
        <VStack bg={"white"} h={"100vh"} justifyContent={"center"}>
          <Button onClick={loginHandler} colorScheme={"blue"}>
            Sign In With Google
          </Button>
        </VStack>
        </>
      )}
    </Box>
  );
}

export default App;
