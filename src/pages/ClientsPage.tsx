
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
import { Client } from "@/types";
import { Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";

const ClientsPage = () => {
  const { clients, addClient, updateClient, deleteClient } = useAppStore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewHistoryDialogOpen, setIsViewHistoryDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = () => {
    addClient(formData);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Client added",
      description: "The client has been added successfully.",
    });
  };

  const handleEditClient = () => {
    if (currentClient) {
      updateClient(currentClient.id, formData);
      setIsEditDialogOpen(false);
      toast({
        title: "Client updated",
        description: "The client has been updated successfully.",
      });
    }
  };

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    toast({
      title: "Client deleted",
      description: "The client has been deleted successfully.",
    });
  };

  const editClient = (client: Client) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setIsEditDialogOpen(true);
  };

  const viewClientHistory = (client: Client) => {
    setCurrentClient(client);
    setIsViewHistoryDialogOpen(true);
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const address = row.getValue("address") as string;
        return <div className="max-w-[200px] truncate">{address}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return <div>{new Date(date).toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => viewClientHistory(client)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View History</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editClient(client)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteClient(client.id)}>
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
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Client</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
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
                <Button onClick={handleAddClient}>Add Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={clients}
          searchColumn="name"
          searchPlaceholder="Search clients..."
        />

        {/* Edit Client Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
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
              <Button onClick={handleEditClient}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Client History Dialog */}
        <Dialog
          open={isViewHistoryDialogOpen}
          onOpenChange={setIsViewHistoryDialogOpen}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Purchase History - {currentClient?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 max-h-[400px] overflow-y-auto">
              {currentClient && (
                <>
                  {useAppStore.getState().sales.filter(
                    (sale) => sale.clientId === currentClient.id
                  ).length > 0 ? (
                    <div className="space-y-4">
                      {useAppStore
                        .getState()
                        .sales.filter(
                          (sale) => sale.clientId === currentClient.id
                        )
                        .sort((a, b) => {
                          return new Date(b.date).getTime() - new Date(a.date).getTime();
                        })
                        .map((sale) => (
                          <div
                            key={sale.id}
                            className="border rounded-md p-4 bg-muted/30"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-medium">
                                Sale #{sale.id.substring(0, 8)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(sale.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="space-y-2">
                              {sale.items.map((item) => {
                                const product = useAppStore
                                  .getState()
                                  .products.find((p) => p.id === item.productId);
                                return (
                                  <div
                                    key={item.id}
                                    className="flex justify-between text-sm"
                                  >
                                    <div>
                                      {product?.name || "Unknown Product"} x{" "}
                                      {item.quantity}
                                    </div>
                                    <div>{item.price * item.quantity} €</div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t">
                              <div className="font-medium">Total</div>
                              <div className="font-bold">{sale.total} €</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No purchase history found for this client.
                    </div>
                  )}
                </>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsViewHistoryDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ClientsPage;
