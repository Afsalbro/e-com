import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../features/cartSlice";
import {
  setSearchTerm,
  setFilterCategory,
  setPriceRange,
  applyMultipleFilters,
} from "../features/productSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast, Toaster } from "sonner";
import {
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "next-themes";

const Dashboard = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.filteredProducts);
  const allProducts = useSelector((state) => state.products.products);
  const cartItems = useSelector((state) => state.cartItems.cartItems);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTermLocal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRangeLocal] = useState([0, 100]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart!");
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    } else {
      dispatch(removeFromCart(id));
      toast.success("Item removed from cart!");
    }
  };

  const handleSearch = (value) => {
    setSearchTermLocal(value);
    dispatch(setSearchTerm(value));
    dispatch(applyMultipleFilters());
  };

  const handleCategoryFilter = (value) => {
    setSelectedCategory(value);
    dispatch(setFilterCategory(value === "all" ? "" : value));
    dispatch(applyMultipleFilters());
  };

  const handlePriceRangeChange = (value) => {
    setPriceRangeLocal(value);
    dispatch(setPriceRange({ min: value[0], max: value[1] }));
    dispatch(applyMultipleFilters());
  };

  useEffect(() => {
    dispatch(applyMultipleFilters());
  }, [dispatch]);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const categories = [
    "all",
    ...new Set(allProducts.map((product) => product.category)),
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Toaster />
      <header className="flex justify-between items-center p-4 bg-white shadow-md w-full sticky top-0 z-50 dark:bg-gray-800 dark:shadow-lg">
        
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex justify-end gap-5">
        <ModeToggle />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="dark:bg-gray-800 dark:text-gray-200">
            <SheetHeader>
              <SheetTitle>Your Cart</SheetTitle>
              <SheetDescription>
                Review your cart items and proceed to checkout.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {cartItems.length > 0 && (
                <div className="pt-4 border-t dark:border-gray-700">
                  <p className="font-semibold text-lg">
                    Total: ${totalCost.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </header>

      <main className="container mx-auto pt-40">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryFilter}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </p>
            <Slider
              min={0}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
            />
          </div>
        </div>

        {/* Product Listing */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full min-h-[600px]">
          {products.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-[600px]">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No products found in this category.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden h-[400px] flex flex-col w-full dark:bg-gray-800 dark:text-gray-200"
              >
                <CardHeader className="p-0">
                  <div className="relative w-full h-60">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {product.description}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">
                      ${product.price.toFixed(2)}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      variant="outline"
                      className={`flex items-center space-x-2 ${
                        theme === "dark"
                          ? "dark:bg-gray-700 dark:text-primary dark:hover:bg-gray-600"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                    >
                      <ShoppingCart
                        className={`h-4 w-4 ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        Add to Cart
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
