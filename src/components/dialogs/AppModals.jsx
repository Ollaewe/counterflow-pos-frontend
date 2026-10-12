import React from "react";
import Modal from "../ui/Modal.jsx";
import ProductForm from "./ProductForm.jsx";
import StockAdjustmentForm from "./StockAdjustmentForm.jsx";
import CustomerForm from "./CustomerForm.jsx";
import StaffForm from "./StaffForm.jsx";
import OpenShiftForm from "./OpenShiftForm.jsx";
import CloseShiftDialog from "./CloseShiftDialog.jsx";
import ShiftSummary from "./ShiftSummary.jsx";
import PaymentConfirmation from "./PaymentConfirmation.jsx";
import ReceiptDialog from "../receipt/ReceiptDialog.jsx";
import HoldSaleForm from "./HoldSaleForm.jsx";
import HeldSales from "./HeldSales.jsx";
import ClearCartConfirmation from "./ClearCartConfirmation.jsx";
import ArchiveProductConfirmation from "./ArchiveProductConfirmation.jsx";
import RefundForm from "./RefundForm.jsx";
import { usePOS } from "../../context/POSContext.jsx";

export default function AppModals() {
  const { error, modal, setModal, busy, receipt } = usePOS();
  if (!modal) return null;
  return (
    <Modal
      title={
        {
          product: modal.data.id ? "Edit product" : "Add product",
          stock: "Adjust stock",
          customer: "Add customer",
          staff: modal.data.id ? "Manage team member" : "Add team member",
          openShift: "Open cash shift",
          closeShift: "Close & reconcile",
          shiftDetail: "Shift summary",
          receipt: "Sale receipt",
          payment: "Confirm payment",
          hold: "Hold this sale",
          held: "Held sales",
          clear: "Clear this cart?",
          archive: modal.data.active ? "Archive product?" : "Restore product?",
          refund: "Refund sale",
        }[modal.type]
      }
      onClose={() => !busy && setModal(null)}
      wide={modal.type === "receipt"}
    >
      {error && <div className="error modal-error">{error}</div>}
      {modal.type === "product" && <ProductForm />}
      {modal.type === "stock" && <StockAdjustmentForm />}
      {modal.type === "customer" && <CustomerForm />}
      {modal.type === "staff" && <StaffForm />}
      {modal.type === "openShift" && <OpenShiftForm />}
      {modal.type === "closeShift" && <CloseShiftDialog />}
      {modal.type === "shiftDetail" && <ShiftSummary />}
      {modal.type === "payment" && <PaymentConfirmation />}
      {receipt && <ReceiptDialog />}
      {modal.type === "hold" && <HoldSaleForm />}
      {modal.type === "held" && <HeldSales />}
      {modal.type === "clear" && <ClearCartConfirmation />}
      {modal.type === "archive" && <ArchiveProductConfirmation />}
      {modal.type === "refund" && <RefundForm />}
    </Modal>
  );
}
