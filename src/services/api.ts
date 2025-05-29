import { Category } from "../types/Category";
import { CategoryDetail } from "../types/CategoryDetail";
import { ImportTicket } from "../types/ImportTicket";
import { OrderTicket } from "../types/OrderTicket";

import { Pagination } from "../types/Pagination";
import { Product } from "../types/Product";
import { Supplier } from "../types/Supplier";
import { Voucher } from "../types/Voucher";
import axios from "../utils/axiosCustomize";

const deleteCategory = (id: string) => {
  return axios.delete(`category/${id}`);
};

const getAllCategoriesExist = (body: { page: string; size: string }) => {
  return axios.get<{ meta: Pagination; result: Category[] }>(
    `/category/all?filter=status:true&page=${body.page}&size=${body.size}`
  );
};

const getAllCategoriesDetailExist = (body: { page: string; size: string }) => {
  return axios.get<{
    meta: Pagination;
    result: CategoryDetail[];
  }>(
    `/categorydetails/all?filter=status:true&page=${body.page}&size=${body.size}`
  );
};

const getAllProductsExist = (body: { page: string; size: string }) => {
  return axios.get<{
    meta: Pagination;
    result: Product[];
  }>(`/products/all?filter=status:true&page=${body.page}&size=${body.size}`);
};

const getAllVouchersExist = (body: { page: string; size: string }) => {
  return axios.get<{
    meta: Pagination;
    result: Voucher[];
  }>(`/vouchers/all?filter=status:true&page=${body.page}&size=${body.size}`);
};

const getAllSupplierExist = (body: { page: string; size: string }) => {
  return axios.get<{
    meta: Pagination;
    result: Supplier[];
  }>(`/suppliers/all?filter=status:true&page=${body.page}&size=${body.size}`);
};

const getSaleTicketById = (id: string) => {
  return axios.get<OrderTicket>(`/saletickets/client/${id}`);
};

const getImportTicketById = (id: string) => {
  return axios.get<ImportTicket>(`/importtickets/${id}`);
};

const saveInventory = (month: number, year: number) => {
  const formData = new FormData();
  formData.append("month", month.toString());
  formData.append("year", year.toString());
  return axios.post(`/inventory`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getInventoryDetail = (month: number, year: number) => {
  return axios.get(`/inventory`, {
    params: {
      month: month,
      year: year,
    },
  });
};
export {
  getAllCategoriesExist,
  deleteCategory,
  getAllCategoriesDetailExist,
  getAllProductsExist,
  getAllVouchersExist,
  getSaleTicketById,
  getImportTicketById,
  getAllSupplierExist,
  saveInventory,
  getInventoryDetail,
};
