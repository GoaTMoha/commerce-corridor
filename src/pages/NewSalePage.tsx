
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAppStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { Client, Product, SaleItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, ArrowLeft, ShoppingCart } from "lucide-react";

const NewSalePage = () => {
  const { clients, products, categories, addSale } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<Array<{ productId: string; quantity: number; price: number }>>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleAddItem = () => {
    if (!selectedProduct || selectedQuantity <= 0) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    
    if (product.stock < selectedQuantity) {
      toast({
        title: "Insufficient stock",
        description: `Only ${product.stock} units available for ${product.name}`,
        variant: "destructive"
      });
      return;
    }
    
    // Check if product already exists in items
    const existingItemIndex = items.findIndex(item => item.productId === selectedProduct);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      const updatedItems = [...items];
      const newQuantity = updatedItems[existingItemIndex].quantity + selectedQuantity;
      
      if (product.stock < newQuantity) {
        toast({
          title: "Insufficient stock",
          description: `Cannot add more. Only ${product.stock} units available for ${product.name}`,
          variant: "destructive"
        });
        return;
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity;
      setItems(updatedItems);
    } else {
      // Add new item
      setItems([
        ...items,
        {
          productId: selectedProduct,
          quantity: selectedQuantity,
          price: product.price
        }
      ]);
    }
    
    // Reset selection
    setSelectedProduct("");
    setSelectedQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = () => {
    if (!clientId) {
      toast({
        title: "Client required",
        description: "Please select a client for this sale",
        variant: "destructive"
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one product to the sale",
        variant: "destructive"
      });
      return;
    }
    
    const saleItems: SaleItem[] = items.map((item, index) => ({
      id: `item-${index}`,
      saleId: "temp", // This will be replaced after sale creation
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }));
    
    const sale = {
      clientId,
      date: new Date(),
      items: saleItems,
      total: calculateTotal()
    };
    
    addSale(sale);
    
    toast({
      title: "Sale completed",
      description: "The sale has been recorded successfully"
    });
    
    navigate("/sales");
  };
  
  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const getClientById = (id: string): Client | undefined => {
    return clients.find(c => c.id === id);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate("/sales")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">New Sale</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Select the client for this sale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Select value={clientId} onValueChange={setClientId}>
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {clientId && (
                    <div className="pt-4 border-t">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(() => {
                          const client = getClientById(clientId);
                          if (!client) return null;
                          
                          return (
                            <>
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                                <dd>{client.email}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                                <dd>{client.phone}</dd>
                              </div>
                              <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                                <dd>{client.address}</dd>
                              </div>
                            </>
                          );
                        })()}
                      </dl>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Add products to this sale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <Label htmlFor="product">Product</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger id="product">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {categories.map(category => {
                            const categoryProducts = products.filter(p => p.categoryId === category.id);
                            if (categoryProducts.length === 0) return null;
                            
                            return (
                              <div key={category.id} className="py-1">
                                <div className="text-sm font-semibold px-2 py-1 bg-muted">{category.name}</div>
                                {categoryProducts.map(product => (
                                  <SelectItem key={product.id} value={product.id} disabled={product.stock <= 0}>
                                    {product.name} 
                                    {product.stock <= 0 ? ' (Out of stock)' : ` - ${product.price.toLocaleString()} €`}
                                  </SelectItem>
                                ))}
                              </div>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-3">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div className="col-span-3 flex items-end">
                      <Button onClick={handleAddItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  {selectedProduct && (
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        const product = getProductById(selectedProduct);
                        if (!product) return null;
                        return (
                          <span>
                            Available: <strong>{product.stock}</strong> units
                            {product.stock <= product.alertThreshold && (
                              <span className="text-yellow-600 ml-2">(Low stock)</span>
                            )}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sale Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Product</th>
                          <th className="text-right py-3 px-2">Unit Price</th>
                          <th className="text-right py-3 px-2">Quantity</th>
                          <th className="text-right py-3 px-2">Total</th>
                          <th className="py-3 px-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => {
                          const product = getProductById(item.productId);
                          
                          return (
                            <tr key={index} className="border-b hover:bg-muted/30">
                              <td className="py-3 px-2">{product?.name || "Unknown Product"}</td>
                              <td className="text-right py-3 px-2">{item.price.toLocaleString()} €</td>
                              <td className="text-right py-3 px-2">{item.quantity}</td>
                              <td className="text-right py-3 px-2 font-medium">
                                {(item.price * item.quantity).toLocaleString()} €
                              </td>
                              <td className="py-3 px-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Sale Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span>Total Items:</span>
                    <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold border-t pt-4">
                    <span>Total:</span>
                    <span>{calculateTotal().toLocaleString()} €</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={items.length === 0 || !clientId}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Complete Sale
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewSalePage;
