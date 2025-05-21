export type CartItemWithOptionUnits = {
  id: number;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  deletedAt: Date | null;
  product: {
    price: number;
  };
  cartItemOptionUnit: {
    productionOptionUnit: {
      id: number;
      name: string;
      additionalPrice: number;
    };
  }[];
};
