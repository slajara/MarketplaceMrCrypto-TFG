import React, { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import Button from "./Button";

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  tokenId: number;
  nftAddress: string;
  closeModal: () => void;
}

export default function LisItemDialog(props: ModalType) {
  const [isListing, setIsListing] = useState(false);
  const { mutate: createListing } = api.listings.createListedItem.useMutation({
    onSuccess: (data) => {
      console.log("createdListedItem", `${data?.listedItem}`);
      setIsListing(false);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data: session } = useSession();

  return (
    <>
      <dialog className="modal" open={props.isOpen}>
        <div className="bg-black modal-box w-full content-center border-2">
          <h3 className="text-3xl font-bold">
            <p className="text-black">
              Create listing for #{props.tokenId.toString()}
            </p>
          </h3>
          <form
            onSubmit={handleSubmit((data) => {
              console.log("data", data);
              //setIsListing(true);

              createListing({
                paytoken: data.paytoken,
                price: Number(data.price),
                seller: session?.user.address ?? "",
                timestamp: Date.now(),
                tokenId: props.tokenId,
                nftAddress: "0x0dB6F4726432a4B5fF296CF34216Ad06D0fdC16d",
              });
            })}
            className="flex flex-col space-y-5"
          >
            <input
              {...register("paytoken", { required: true })}
              type="text"
              placeholder="Pay token address"
              className="max-w-x input-accent input mt-5 w-full"
            />
            {errors.firstName && (
              <p className="ml-2 text-[color:red]">
                Pay token address is required.
              </p>
            )}
            <input
              {...register("price", { pattern: /\d+/, required: true })}
              type="number"
              placeholder="Price"
              className="max-w-x input-accent input mt-5 w-full"
            />
            {errors.price && (
              <p className="ml-2 text-[color:red]">Please enter a price.</p>
            )}

            {isListing ? (
              <span className="loading loading-bars loading-lg self-center"></span>
            ) : (
              <input
                type="submit"
                className="btn-primary btn w-full text-[color:white] hover:z-10 hover:scale-105"
                value={"List"}
              />
            )}

            <Button
              onClick={props.closeModal}
              classNameToOverride="btn-error btn mt-5 w-full hover:z-10 hover:scale-105 self-center rounded-xl border-2 p-3 font-bold text-[color:white]"
            >
              Cerrar
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );

  function onCreateListing() {}
}
