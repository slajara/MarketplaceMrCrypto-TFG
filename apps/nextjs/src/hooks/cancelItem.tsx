import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import Button from "~/components/Button";
import ABI_MK from "../constants/constantMarketplace.json";

interface CancelListingProps {
  tokenId: number;
}

const CancelListing: React.FC<CancelListingProps> = ({ tokenId }) => {
  const {
    config,
    // error: prepareError,
    // isError: isPrepareError,
  } = usePrepareContractWrite({
    address: `0x${ABI_MK.address.slice(2)}`,
    abi: JSON.parse(ABI_MK.abi) as any[],
    chainId: 80001,
    functionName: "cancelListing",
    args: [tokenId],
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <Button
        className="btn-secondary btn"
        disabled={!write || isLoading}
        onClick={() => {
          write && write();
        }}
      >
        {isLoading ? "Canceling..." : "Cancel"}
      </Button>
      {isSuccess && (
        <div className="flex items-center justify-center">
          Successfully canceled your listing!
          <div>
            <a href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}>
              mumbai.polygonscan
            </a>
          </div>
        </div>
      )}
      {isError && (
        <div className="flex items-center justify-center">
          <div>{error?.message}</div>
        </div>
      )}
    </div>
  );
};

export default CancelListing;
