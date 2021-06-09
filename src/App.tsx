import { useState } from "react";
import { Box, Container, Flex } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { LoadReview } from "./components/LoadReview";
import { ChakraProvider } from "@chakra-ui/react";
import { ReviewList } from "./components/ReviewList";

const App = () => {
  const [refresh, setRefresh] = useState<Boolean>(false);

  return (
    <ChakraProvider>
      <Container centerContent>
        <Flex justify="center" direction="column">
          <Header />
          <LoadReview setRefresh={setRefresh} refresh={refresh} />
          <ReviewList refresh={refresh} setRefresh={setRefresh} />
        </Flex>
      </Container>
    </ChakraProvider>
  );
};

export default App;
