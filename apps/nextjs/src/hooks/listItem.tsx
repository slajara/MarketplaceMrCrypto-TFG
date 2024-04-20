import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import Button from "~/components/Button";
import ABI_ERC721 from "../constants/constantERC721.json";
import ABI_MK from "../constants/constantMarketplace.json";

interface ItemListingProps {
  tokenId: number;
  listingPrice: number;
  paytoken: string;
}

const ItemListing: React.FC<ItemListingProps> = ({
  tokenId,
  listingPrice,
  paytoken,
}) => {
  const {
    config: configApprove,
    // error: prepareErrorApprove,
    // isError: isPrepareErrorApprove,
  } = usePrepareContractWrite({
    address: `0x${ABI_ERC721.address.slice(2)}`,
    abi: JSON.parse(ABI_ERC721.abi) as any[],
    chainId: 80001,
    functionName: "approve",
    args: [`0x${ABI_MK.address.slice(2)}`, tokenId],
  });

  const {
    config: configListItem,
    // error: prepareErrorListItem,
    // isError: isPrepareErrorListItem,
  } = usePrepareContractWrite({
    address: `0x${ABI_MK.address.slice(2)}`,
    abi: JSON.parse(ABI_MK.abi) as any[],
    chainId: 80001,
    functionName: "listItem",
    args: [paytoken, tokenId, listingPrice],
  });

  const {
    data: dataApprove,
    error: errorApprove,
    isError: isErrorApprove,
    write: writeApprove,
  } = useContractWrite(configApprove);

  const {
    data: dataListItem,
    error: errorListItem,
    isError: isErrorListItem,
    write: writeListItem,
  } = useContractWrite(configListItem);

  const { isLoading: isLoadingApprove, isSuccess: isSuccessApprove } =
    useWaitForTransaction({
      hash: dataApprove?.hash,
      onSuccess: () => {
        writeListItem && writeListItem();
      },
    });

  const { isLoading: isLoadingListItem, isSuccess: isSuccessListItem } =
    useWaitForTransaction({
      hash: dataListItem?.hash,
    });

  return (
    <div>
      <Button
        className="btn-secondary btn hover:bg-primary"
        //disabled={!writeApprove || isLoadingApprove || isLoadingListItem}
        disabled={isLoadingApprove || isLoadingListItem}
        onClick={() => {
          writeApprove && writeApprove();
        }}
      >
        {isLoadingApprove
          ? "Approving..."
          : isLoadingListItem
          ? "Listing..."
          : isSuccessListItem
          ? "Item Listed"
          : isSuccessApprove
          ? "Item Approved"
          : "List Item"}
      </Button>
      {isSuccessApprove && (
        <div className="flex items-center justify-center">
          Successfully approved!
          <div>
            <a href={`https://mumbai.polygonscan.com/tx/${dataApprove?.hash}`}>
              mumbai.polygonscan
            </a>
          </div>
        </div>
      )}
      {isSuccessListItem && (
        <div className="flex items-center justify-center">
          Successfully Listed!
          <div>
            <a href={`https://mumbai.polygonscan.com/tx/${dataListItem?.hash}`}>
              mumbai.polygonscan
            </a>
          </div>
        </div>
      )}
      {isErrorApprove && (
        <div className="flex items-center justify-center">
          <div>{errorApprove?.message}</div>
        </div>
      )}
      {isErrorListItem && (
        <div className="flex items-center justify-center">
          <div>{errorListItem?.message}</div>
        </div>
      )}
    </div>
  );
};

export default ItemListing;
