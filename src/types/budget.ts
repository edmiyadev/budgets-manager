import { Category } from "@/types/category";

export interface Budget {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  categories: Category[];
  totalExpected: number;
}
