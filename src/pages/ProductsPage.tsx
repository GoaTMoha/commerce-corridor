
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAppStore } from "@/lib/store";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, Category } from "@/types";
import { Plus, MoreHorizontal, Edit, Trash2, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";

const ProductsPage = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory } = useAppStore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    stock: 0,
    alertThreshold: 0,
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
  });

  const handleProductInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setProductFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" || name === "alertThreshold" ? Number(value) : value,
    }));
  };

  const handleCategoryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    addProduct(productFormData);
    setProductFormData({
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      stock: 0,
      alertThreshold: 0,
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Product added",
      description: "The product has been added successfully.",
    });
  };

  const handleEditProduct = () => {
    if (currentProduct) {
      updateProduct(currentProduct.id, productFormData);
      setIsEditDialogOpen(false);
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully.",
    });
  };

  const handleAddCategory = () => {
    addCategory(categoryFormData);
    setCategoryFormData({ name: "", description: "" });
    setIsCategoryDialogOpen(false);
    toast({
      title: "Category added",
      description: "The category has been added successfully.",
    });
  };

  const editProduct = (product: Product) => {
    setCurrentProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      stock: product.stock,
      alertThreshold: product.alertThreshold,
    });
    setIsEditDialogOpen(true);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.getValue("categoryId") as string;
        const category = categories.find((c) => c.id === categoryId);
        return <div>{category?.name || "Uncategorized"}</div>;
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return <div>{price.toLocaleString()} €</div>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const alertThreshold = row.original.alertThreshold;
        return (
          <div className="flex items-center gap-2">
            {stock}{" "}
            {stock <= alertThreshold && (
              <span className="inline-flex h-2 w-2 rounded-full bg-destructive"></span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return <div className="max-w-[200px] truncate">{description}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => editProduct(product)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <div className="flex gap-2">
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      name="name"
                      value={categoryFormData.name}
                      onChange={handleCategoryInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category-description">Description</Label>
                    <Input
                      id="category-description"
                      name="description"
                      value={categoryFormData.description}
                      onChange={handleCategoryInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCategoryDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={productFormData.name}
                      onChange={handleProductInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={productFormData.categoryId}
                      onValueChange={(value) =>
                        setProductFormData((prev) => ({
                          ...prev,
                          categoryId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (€)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productFormData.price}
                      onChange={handleProductInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={productFormData.stock}
                      onChange={handleProductInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alertThreshold">Alert Threshold</Label>
                    <Input
                      id="alertThreshold"
                      name="alertThreshold"
                      type="number"
                      min="0"
                      value={productFormData.alertThreshold}
                      onChange={handleProductInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={productFormData.description}
                      onChange={handleProductInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>Add Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={products}
          searchColumn="name"
          searchPlaceholder="Search products..."
        />

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={productFormData.name}
                  onChange={handleProductInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={productFormData.categoryId}
                  onValueChange={(value) =>
                    setProductFormData((prev) => ({
                      ...prev,
                      categoryId: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (€)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productFormData.price}
                  onChange={handleProductInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={productFormData.stock}
                  onChange={handleProductInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-alertThreshold">Alert Threshold</Label>
                <Input
                  id="edit-alertThreshold"
                  name="alertThreshold"
                  type="number"
                  min="0"
                  value={productFormData.alertThreshold}
                  onChange={handleProductInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  name="description"
                  value={productFormData.description}
                  onChange={handleProductInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditProduct}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ProductsPage;
