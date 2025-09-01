import { ReviewScore } from '@prisma/client';

export type MyReviewItemList = {
  id: number;
  product: {
    name: string;
    price: number;
  };
  orderItem: {
    productOptionUnit: {
      name: string;
      additionalPrice: number;
    };
    quantity: number;
  };
  score: ReviewScore;
  content: string;
  updatedAt: Date;
};
