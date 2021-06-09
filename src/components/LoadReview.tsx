import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Textarea,
  FormErrorMessage,
} from "@chakra-ui/react";
import ImageUploading from "react-images-uploading";
import { addTableLine, uploadFileToBlob } from "../utils/BlobFunctions";
import shortid from "shortid";
import { useForm } from "react-hook-form";

interface LoadReviewProps {
  setRefresh: (change: Boolean) => any;
  refresh: Boolean;
}

interface Img {
  data_url: string;
  file: File;
}

export const LoadReview: React.FC<LoadReviewProps> = ({
  setRefresh,
  refresh,
}) => {
  const [image, setImage] = useState<Img[]>([]);
  const maxNumber = 1;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function validateName(value: string) {
    if (!value) {
      return "Name is required";
    } else if (value.length < 8) {
      return "Your Name is too long. (20 characters max)";
    } else return true;
  }

  function validateMessage(value: string) {
    if (!value) {
      return "Message is required";
    } else if (value.length > 80) {
      return "Your Message is too long. (80 characters max)";
    } else return true;
  }

  const onSubmit = async (data: any, e: any) => {
    const id = shortid.generate();
    const file = image[0].file;
    await uploadFileToBlob(file, id);
    await addTableLine(data.Name, data.Message, id);
    setImage([]);
    e.target.reset();
    setTimeout(() => {
      setRefresh(!refresh);
      console.log("refresh", refresh);
    }, 500);
  };

  const onChange = (imageList: any) => {
    setImage(imageList);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column">
        <FormControl isInvalid={errors.Name}>
          <Input
            placeholder="Name"
            marginBottom="3"
            {...register("Name", { required: true, maxLength: 20 })}
          />
          <FormErrorMessage mb={2}>
            {errors.Name && errors.Name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.Message}>
          <Textarea
            placeholder="Message"
            marginBottom="3"
            {...register("Message", { required: true, maxLength: 80 })}
          />
          <FormErrorMessage mb={2}>
            {errors.Message && errors.Message.message}
          </FormErrorMessage>
        </FormControl>

        <Flex justify="center">
          <ImageUploading
            value={image}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <Button
                  style={isDragging ? { color: "red" } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Click or Drop here to load the Image
                </Button>
                <Flex justify="center">
                  {imageList.map((image, index) => (
                    <Box key={index} paddingTop="5">
                      <Flex justify="center">
                        <img src={image["data_url"]} alt="" width="100" />
                      </Flex>
                      <Button size="xs" onClick={() => onImageUpdate(index)}>
                        Update
                      </Button>
                      <Button size="xs" onClick={() => onImageRemove(index)}>
                        Remove
                      </Button>
                    </Box>
                  ))}
                </Flex>
              </div>
            )}
          </ImageUploading>
        </Flex>
      </Flex>
      <Flex justifyContent="center" marginTop="5">
        <Button colorScheme="teal" size="md" type="submit">
          Post the Review
        </Button>
      </Flex>
    </form>
  );
};
