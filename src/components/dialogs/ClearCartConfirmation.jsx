import React from "react";
import Button from "../ui/Button.jsx";
import { usePOS } from "../../context/POSContext.jsx";

export default function ClearCartConfirmation() {
  const { setModal, setCart, setCustomer, setDiscount, setTender, setSaleKey } =
    usePOS();
  return (
    <div className="form-body">
      <p>Remove all items from the current sale?</p>
      <Button
        className="danger full"
        onClick={() => {
          setCart([]);
          setTender("");
          setDiscount("0");
          setCustomer("");
          setSaleKey(crypto.randomUUID());
          setModal(null);
        }}
      >
        Clear cart
      </Button>
    </div>
  );
}
