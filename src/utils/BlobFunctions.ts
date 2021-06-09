import {
  BlobServiceClient,
  BlobUploadCommonResponse,
  ContainerClient,
} from "@azure/storage-blob";
import azure from "azure-storage";

const entGen = azure.TableUtilities.entityGenerator;
const table = "reviews";
const containerName = `pictures1`;

const sasToken =
  process.env.storagesastoken ||
  "?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacuptfx&se=2021-08-31T21:00:00Z&st=2021-06-09T07:31:26Z&spr=https&sig=ALAeqa4yES4%2BmYRl92AC%2Fhl6%2Fw00V7FQ9BdwZ3K1e%2B8%3D";
const storageAccountName =
  process.env.storageresourcename || "guestbookstoragemaster"; // Fill string with your Storage resource name

const createBlobInContainer = async (
  containerClient: ContainerClient,
  file: File,
  id: string
): Promise<BlobUploadCommonResponse> => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(id);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  return await blobClient.uploadBrowserData(file, options);
};

export const getTableContent = () => {
  return new Promise(function (resolve, reject) {
    try {
      const tableService = azure.createTableService(
        "DefaultEndpointsProtocol=https;AccountName=guestbookstoragemaster;AccountKey=PE+pPSWckshZVeALpHAX5A/ZK9C9aFKI/E6HozPwP8LJ1eHzN713rHQ/J3/DfL6RnavjddTHmbhllD2kX7xVQw==;EndpointSuffix=core.windows.net"
      );
      const query = new azure.TableQuery().select();
      tableService.queryEntities(
        table,
        query,
        null!,
        function (error, result: any, response) {
          if (!error) {
            if (result.entries[0] !== undefined) {
              resolve(result.entries);
            } else {
              reject("code not found");
            }
          } else {
            reject(error);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

export const addTableLine = (name: string, message: string, id: string) => {
  return new Promise((resolve, reject) => {
    try {
      const tableService = azure.createTableService(
        "DefaultEndpointsProtocol=https;AccountName=guestbookstoragemaster;AccountKey=PE+pPSWckshZVeALpHAX5A/ZK9C9aFKI/E6HozPwP8LJ1eHzN713rHQ/J3/DfL6RnavjddTHmbhllD2kX7xVQw==;EndpointSuffix=core.windows.net"
      );
      const query = new azure.TableQuery().top(1).where("RowKey eq ?", id);
      tableService.queryEntities(
        table,
        query,
        null!,
        function (error: any, result: any, response: any) {
          if (!error) {
            const link = {
              PartitionKey: entGen.String(id),
              RowKey: entGen.String(new Date().toString()),
              name: entGen.String(name),
              message: entGen.String(message),
            };
            tableService.insertEntity(
              table,
              link,
              function (error, result, response) {
                if (!error) {
                  resolve(id);
                }
                reject(error);
              }
            );
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

export const uploadFileToBlob = async (file: File | null, id: string) => {
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient: ContainerClient = blobService.getContainerClient(
    containerName
  );
  //   await containerClient.createIfNotExists({
  //     access: "container",
  //   });

  // upload file
  const res = await createBlobInContainer(containerClient, file, id);
  return res;
};

export const getBlobsInContainer = async (): Promise<string[]> => {
  const returnedBlobUrls: string[] = [];
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  const containerClient: ContainerClient = blobService.getContainerClient(
    containerName
  );

  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
};

// export const uploadData = async () => {
//   console.log("react_var", AZURE_STORAGE_CONNECTION_STRING);

//   const blobServiceClient = BlobServiceClient.fromConnectionString(
//     AZURE_STORAGE_CONNECTION_STRING
//   );

//   const blobName = "quickstart" + ".txt";

//   const containerClient = blobServiceClient.getContainerClient("pictures");

//   // Get a block blob client
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   console.log("\nUploading to Azure storage as blob:\n\t", blobName);

//   // Upload data to the blob
//   const data = "Hello, World!";
//   const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
//   console.log(
//     "Blob was uploaded successfully. requestId: ",
//     uploadBlobResponse.requestId
//   );
// };
