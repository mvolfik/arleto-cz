import type { SvelteComponent } from "svelte";

export type ImageInfo = {
  id: string;
  sizes: number[];
  formats: string[];
};

export type Prop = {
  key: string;
  value: string;
};

export type PartialItem = Pick<Item, "title" | "price" | "stock" | "image" | "description">;
export type Item = {
  title: string;
  price: number;
  stock: number;
  image: ImageInfo;
  description: string;
  props?: Array<Prop>;
  body: string;
  gallery?: Array<{ image: ImageInfo }>;
};

export type PartialProjectInfo = Pick<ProjectInfo, "title" | "month" | "year" | "image">;
export type ProjectInfo = {
  title: string;
  month: number;
  year: number;
  image: ImageInfo;
  body: string;
  gallery?: Array<{ image: ImageInfo }>;
};

export type CheckoutInfo = {
  price: number;
  title: string;
  storedData?: any;
};

export type CheckoutStageCheckFunction = (
  allData: Array<CheckoutInfo | undefined>
) => true | string;

export type CheckoutStage = SvelteComponent & {
  // data: CheckoutInfo | undefined;
  check: CheckoutStageCheckFunction;
  title: string;
};

export type ShippingOption = SvelteComponent &
  CheckoutInfo & {
    check: CheckoutStageCheckFunction;
  };

export type Address = {
  name: string;
  company: string;
  street: string;
  city: string;
  note: string;
};

export type ZasilkovnaInfo = {
  id: number;
  name: string;
  place: string;
  error: null | "vacation" | "full" | "closing" | string;
  warning: null | "almostFull";
  recommended: null | "quick";
  isNew: boolean;
};

export type CartItems = Record<string, number>;

export function calculateCartTotals(
  shopItems: Record<string, PartialItem>,
  cartItems: CartItems
): { count: number; sum: number } {
  let count = 0;
  let sum = 0;
  Object.entries(cartItems).forEach(([id, c]) => {
    count += c;
    sum += c * (shopItems[id]?.price ?? 0);
  });

  return { count, sum };
}

export type PacketaAPI = {
  Widget: {
    pick: (
      apiKey: string,
      callback: (info: null | ZasilkovnaInfo) => void,
      options: { language: string }
    ) => void;
  };
};
