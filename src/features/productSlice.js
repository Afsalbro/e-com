import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [
    {
      id: 1,
      name: "Red tube bottle on white table",
      price: 25.0,
      description: "This is a description for red tube bottle on white table.",
      image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Bottle"
    },
    {
      id: 2,
      name: "Adidas Sneaker",
      price: 40.0,
      description: "So impressed with how comfortable and light these trainers",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGUlMjBjb21tZXJjZSUyMHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
      category: "Shoes"
    },
    {
      id: 3,
      name: "Reebok",
      price: 15.0,
      description: "In the Air",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1898&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Shoes"
    },
    {
      id: 4,
      name: "Perfume",
      price: 30.0,
      description: "Vogue Perfume",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1904&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Cosmetics"
    },
  ],
  filteredProducts: [],
  searchTerm: '',
  filterCategory: '',
  priceRange: { min: 0, max: 100 }
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredProducts = state.products.filter(product => 
        product.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        product.description.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
      state.filteredProducts = state.products.filter(product => 
        action.payload === '' || product.category === action.payload
      );
    },
    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.priceRange = { min, max };
      state.filteredProducts = state.products.filter(product => 
        product.price >= min && product.price <= max
      );
    },
    applyMultipleFilters: (state) => {
      state.filteredProducts = state.products.filter(product => {
        const matchesSearch = state.searchTerm === '' || 
          (product.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
           product.description.toLowerCase().includes(state.searchTerm.toLowerCase()));
        
        const matchesCategory = state.filterCategory === '' || 
          product.category === state.filterCategory;
        
        const matchesPrice = product.price >= state.priceRange.min && 
          product.price <= state.priceRange.max;
        
        return matchesSearch && matchesCategory && matchesPrice;
      });
    }
  },
});

export const { 
  addProduct, 
  removeProduct, 
  setSearchTerm, 
  setFilterCategory, 
  setPriceRange,
  applyMultipleFilters
} = productSlice.actions;
export default productSlice.reducer;