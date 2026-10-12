import React from "react";
import {
  LayoutDashboard,
  ShoppingBasket,
  Package,
  Boxes,
  ReceiptText,
  Users,
  UserRoundCog,
  ChartNoAxesCombined,
  Settings,
  Wallet,
} from "lucide-react";

export const nav = [
  ["overview", "Overview", LayoutDashboard],
  ["pos", "Point of sale", ShoppingBasket],
  ["products", "Products", Package],
  ["inventory", "Inventory", Boxes],
  ["sales", "Sales history", ReceiptText],
  ["customers", "Customers", Users],
  ["staff", "Team & access", UserRoundCog],
  ["reports", "Reports", ChartNoAxesCombined],
  ["shifts", "Cash shifts", Wallet],
  ["settings", "Store settings", Settings],
];
