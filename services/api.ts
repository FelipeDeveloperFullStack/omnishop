// services/api.ts
import axios from 'axios';
import { Product, Category } from '@/types';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products');
  return data;
}

export async function getProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/products/categories');
  return data;
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const { data } = await api.get<Product[]>(`/products/category/${encodeURIComponent(category)}`);
  return data;
}
