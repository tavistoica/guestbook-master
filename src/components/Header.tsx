import { Text } from "@chakra-ui/react";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <Text
      fontSize="3xl"
      textTransform={"uppercase"}
      fontWeight="bold"
      align="center"
      padding="10"
    >
      React Azure GuestBook
    </Text>
  );
};
