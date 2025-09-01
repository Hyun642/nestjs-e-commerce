class ShopDto {
  id: string;
  name: string;
  description: string;
}

export class SearchShopDto {
  total: number;
  page: number;
  limit: number;
  data: ShopDto[];
}
