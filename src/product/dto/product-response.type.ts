export type ProductDetailResponse = {
  productInfo: {
    id: string;
    shopId: string;
    name: string;
    price: number;
    description: string;
    thumbnailImageUrl: string;
    createdAt: Date;
  };
  productImages: { url: string }[];
  productOptionsWithUnits: {
    id: number;
    name: string;
    stock: number;
    isRequired: boolean;
    units: {
      id: number;
      name: string;
      stock: number;
      additionalPrice: number;
    }[];
  }[];
};
