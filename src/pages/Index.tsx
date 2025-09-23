import { useState, useEffect } from "react";
import { USSDCard } from "@/components/USSDCard";
import { AddUSSDDialog } from "@/components/AddUSSDDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Smartphone, Database, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface USSDCode {
  id: string;
  code: string;
  description: string;
  category: string;
  lastResult?: string;
  lastExecuted?: Date;
}

const Index = () => {
  const [ussdCodes, setUssdCodes] = useState<USSDCode[]>([
    {
      id: "1",
      code: "*123#",
      description: "Check Account Balance",
      category: "Balance",
      lastExecuted: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "2", 
      code: "*131#",
      description: "Check Data Balance",
      category: "Data",
    },
    {
      id: "3",
      code: "*100#",
      description: "Airtime Top-up Menu",
      category: "Airtime",
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { toast } = useToast();

  const categories = ["All", ...new Set(ussdCodes.map(code => code.category))];

  const filteredCodes = ussdCodes.filter(code => {
    const matchesSearch = code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.code.includes(searchTerm);
    const matchesCategory = selectedCategory === "All" || code.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const executeUSSD = async (code: string): Promise<string> => {
    // Simulate USSD execution - in real app this would call native Android functionality
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock responses based on code
    if (code === "*123#") {
      return "Your account balance is: $25.50\nValid until: 2024-12-31";
    } else if (code === "*131#") {
      return "Data Balance:\n- 2.5GB remaining\n- Expires: 7 days";
    } else if (code === "*100#") {
      return "Airtime Top-up Menu:\n1. Buy Airtime\n2. Transfer Airtime\n3. Check History";
    }
    
    return `USSD Response for ${code}:\nCommand executed successfully.\nResponse received from network.`;
  };

  const addUSSDCode = (newCode: { code: string; description: string; category: string }) => {
    const ussdCode: USSDCode = {
      id: Date.now().toString(),
      ...newCode,
    };
    setUssdCodes(prev => [...prev, ussdCode]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">USSD Executor</h1>
                <p className="text-muted-foreground">Execute USSD codes from database</p>
              </div>
            </div>
            <AddUSSDDialog onAdd={addUSSDCode} />
          </div>
        </div>
      </div>

      {/* Database Connection Warning */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-warning-foreground">Database Connection Required</h3>
              <p className="text-sm text-muted-foreground">
                Connect to Supabase to store and sync USSD codes across devices. Click the green Supabase button above to set up the integration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search USSD codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* USSD Codes Grid */}
        {filteredCodes.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No USSD Codes Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "All" 
                ? "Try adjusting your search or filter criteria."
                : "Add your first USSD code to get started."
              }
            </p>
            {(!searchTerm && selectedCategory === "All") && (
              <AddUSSDDialog onAdd={addUSSDCode} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCodes.map(code => (
              <USSDCard
                key={code.id}
                ussdCode={code}
                onExecute={executeUSSD}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
