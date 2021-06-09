import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { getBlobsInContainer, getTableContent } from "../utils/BlobFunctions";
import { ReviewCard } from "./ReviewCard";

interface ReviewListProps {
  refresh: Boolean;
  setRefresh: (change: Boolean) => any;
}

interface tableRow {
  RowKey: { _: string };
  PartitionKey: { _: string };
  Timestamp: { _: string };
  name: { _: string };
  message: { _: string };
}

export const ReviewList: React.FC<ReviewListProps> = ({
  refresh,
  setRefresh,
}) => {
  const [pictures, setPictures] = useState<string[]>([]);
  const [details, setDetails] = useState<tableRow[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    setLoading(true);
    getBlobsInContainer().then((res) => {
      setPictures(res);
      if (res.length > 0) {
        getTableContent().then((res: any) => {
          setDetails(res);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [refresh, setRefresh]);

  return (
    <Box bgColor="teal" width={{ base: "100vw", md: "80vw" }} marginTop="10">
      <Text
        fontSize={"xl"}
        color="white"
        textTransform={"uppercase"}
        fontWeight="bold"
        align="center"
        padding="10"
      >
        Review List
      </Text>
      {loading ? (
        <Text
          fontSize={"xl"}
          textTransform={"uppercase"}
          fontWeight="bold"
          align="center"
          padding="10"
          color="white"
        >
          Loading...
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          {pictures.map((item, index) => {
            const processedUrl = item.split("/");
            const id = processedUrl[processedUrl.length - 1];
            const nameAndMessage = details.filter(
              (i) => i.PartitionKey._ === id
            );
            const timeSplitted = nameAndMessage[0].RowKey._.split(" ");
            const time = `${timeSplitted[1]} ${timeSplitted[2]}`;

            return (
              <Box key={index}>
                <ReviewCard
                  name={nameAndMessage[0].name._}
                  message={nameAndMessage[0].message._}
                  imageURL={item}
                  time={time}
                />
              </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};
