import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddUSSDDialogProps {
  onAdd: (ussdData: {
    code: string;
    description: string;
    category: string;
  }) => void;
}

export const AddUSSDDialog = ({ onAdd }: AddUSSDDialogProps) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !description || !category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Basic USSD code validation
    if (!code.startsWith("*") || !code.endsWith("#")) {
      toast({
        title: "Invalid USSD Code",
        description: "USSD codes must start with * and end with #",
        variant: "destructive",
      });
      return;
    }

    onAdd({ code, description, category });
    
    // Reset form
    setCode("");
    setDescription("");
    setCategory("");
    setOpen(false);
    
    toast({
      title: "USSD Code Added",
      description: "New USSD code has been added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Add USSD Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New USSD Code</DialogTitle>
          <DialogDescription>
            Add a new USSD code to your database for execution.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">USSD Code *</Label>
            <Input
              id="code"
              placeholder="e.g., *123# or *100*1#"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Must start with * and end with #
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="e.g., Check account balance"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balance">Balance</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="airtime">Airtime</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Code</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};