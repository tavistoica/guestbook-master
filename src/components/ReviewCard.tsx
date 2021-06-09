import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";

interface ReviewCardProps {
  imageURL: string;
  name: string;
  message: string;
  time: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  imageURL,
  name,
  message,
  time,
}) => {
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${imageURL})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <a href={imageURL}>
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"contain"}
              src={imageURL}
            />
          </a>
        </Box>
        <Stack pt={10} align={"center"}>
          <Flex justify="center" direction="row">
            <Text
              fontSize={"sm"}
              textTransform={"uppercase"}
              fontWeight="bold"
              paddingRight="2"
            >
              {name}
            </Text>
            <Text
              color={"gray.500"}
              fontSize={"sm"}
              textTransform={"uppercase"}
            >
              says
            </Text>
          </Flex>
          <Heading
            fontSize={"2xl"}
            fontFamily={"body"}
            fontWeight={500}
            textTransform={"uppercase"}
          >
            {message}
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={800} fontSize={"sm"}>
              {time}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};
