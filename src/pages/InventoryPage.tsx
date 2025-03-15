
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
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types";
import { AlertTriangle, Package } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

const InventoryPage = () => {
  const { products, categories, updateProduct } = useAppStore();
  const [isAdjustStockDialogOpen, setIsAdjustStockDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);

  // Get products with low stock
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.alertThreshold
  );

  // Get products out of stock
  const outOfStockProducts = products.filter((product) => product.stock === 0);

  const handleAdjustStock = (product: Product) => {
    setCurrentProduct(product);
    setAdjustmentAmount(0);
    setIsAdjustStockDialogOpen(true);
  };

  const handleSaveAdjustment = () => {
    if (currentProduct) {
      updateProduct(currentProduct.id, {
        stock: currentProduct.stock + adjustmentAmount,
      });
      setIsAdjustStockDialogOpen(false);
    }
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
      accessorKey: "stock",
      header: "Current Stock",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const alertThreshold = row.original.alertThreshold;
        return (
          <div
            className={`font-medium ${
              stock === 0
                ? "text-destructive"
                : stock <= alertThreshold
                ? "text-yellow-600"
                : ""
            }`}
          >
            {stock}
          </div>
        );
      },
    },
    {
      accessorKey: "alertThreshold",
      header: "Alert Threshold",
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
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const stock = row.original.stock;
        const alertThreshold = row.original.alertThreshold;

        if (stock === 0) {
          return (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/15 text-destructive">
              Out of stock
            </div>
          );
        } else if (stock <= alertThreshold) {
          return (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Low stock
            </div>
          );
        } else {
          return (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              In stock
            </div>
          );
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustStock(product)}
          >
            Adjust Stock
          </Button>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift animate-fade-in [animation-delay:100ms]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card className="hover-lift animate-fade-in [animation-delay:200ms]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {lowStockProducts.length}
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift animate-fade-in [animation-delay:300ms]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {outOfStockProducts.length}
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift animate-fade-in [animation-delay:400ms]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inventory Value
              </CardTitle>
              <svg
                className="h-4 w-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products
                  .reduce(
                    (total, product) => total + product.price * product.stock,
                    0
                  )
                  .toLocaleString()}{" "}
                €
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full animate-fade-in [animation-delay:500ms]">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <DataTable
              columns={columns}
              data={products}
              searchColumn="name"
              searchPlaceholder="Search inventory..."
            />
          </TabsContent>
          <TabsContent value="low-stock">
            <DataTable
              columns={columns}
              data={lowStockProducts}
              searchColumn="name"
              searchPlaceholder="Search low stock products..."
            />
          </TabsContent>
          <TabsContent value="out-of-stock">
            <DataTable
              columns={columns}
              data={outOfStockProducts}
              searchColumn="name"
              searchPlaceholder="Search out of stock products..."
            />
          </TabsContent>
        </Tabs>

        {/* Adjust Stock Dialog */}
        <Dialog
          open={isAdjustStockDialogOpen}
          onOpenChange={setIsAdjustStockDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adjust Stock</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div>
                <h3 className="font-medium text-lg">
                  {currentProduct?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Current stock: {currentProduct?.stock}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adjustment-type">Adjustment Type</Label>
                <Select
                  onValueChange={(value) => {
                    if (value === "add") {
                      setAdjustmentAmount(Math.abs(adjustmentAmount));
                    } else {
                      setAdjustmentAmount(-Math.abs(adjustmentAmount));
                    }
                  }}
                  defaultValue="add"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add to stock</SelectItem>
                    <SelectItem value="remove">Remove from stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adjustment-amount">Quantity</Label>
                <Input
                  id="adjustment-amount"
                  type="number"
                  min={0}
                  value={Math.abs(adjustmentAmount)}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setAdjustmentAmount(
                      adjustmentAmount < 0 ? -value : value
                    );
                  }}
                />
              </div>
              <div className="border p-4 rounded-md bg-muted/40">
                <p className="text-sm font-medium">Result Preview</p>
                <p className="mt-1">
                  New stock level:{" "}
                  <span className="font-bold">
                    {currentProduct ? currentProduct.stock + adjustmentAmount : 0}
                  </span>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAdjustStockDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAdjustment}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default InventoryPage;
