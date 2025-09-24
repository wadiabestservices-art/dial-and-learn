import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Smartphone, Clock, CreditCard, RefreshCw, CheckCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { USSDExecutor } from "@/components/USSDExecutor";

interface PendingOperation {
  id: string;
  ussdCode: string;
  description: string;
  deviceName: string;
  simCard: string;
  operator: string;
  status: "pending" | "executing" | "completed" | "failed";
  queuedAt: Date;
  estimatedTime?: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingOperations] = useState<PendingOperation[]>([
    {
      id: "1",
      ussdCode: "*123#",
      description: "Account Activation",
      deviceName: "Samsung Galaxy A54",
      simCard: "Slot 1",
      operator: "Inwi",
      status: "pending",
      queuedAt: new Date(Date.now() - 1000 * 60 * 5),
      estimatedTime: "30 seconds"
    },
    {
      id: "2",
      ussdCode: "*131#",
      description: "Data Topup", 
      deviceName: "iPhone 14",
      simCard: "eSIM 1",
      operator: "IAM",
      status: "executing",
      queuedAt: new Date(Date.now() - 1000 * 60 * 2)
    },
    {
      id: "3",
      ussdCode: "*100#",
      description: "Airtime Topup",
      deviceName: "Xiaomi Redmi Note 12",
      simCard: "Slot 2", 
      operator: "Orange",
      status: "completed",
      queuedAt: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      id: "4",
      ussdCode: "*555#",
      description: "Service Activation",
      deviceName: "Samsung Galaxy A54",
      simCard: "Slot 1",
      operator: "Inwi",
      status: "pending",
      queuedAt: new Date(Date.now() - 1000 * 60 * 1),
      estimatedTime: "45 seconds"
    },
    {
      id: "5",
      ussdCode: "*222#",
      description: "Bundle Topup",
      deviceName: "iPhone 14",
      simCard: "Physical SIM",
      operator: "Orange",
      status: "pending",
      queuedAt: new Date(Date.now() - 1000 * 60 * 3),
      estimatedTime: "60 seconds"
    },
    {
      id: "6",
      ussdCode: "*321#",
      description: "Line Activation",
      deviceName: "Xiaomi Redmi Note 12",
      simCard: "Slot 1", 
      operator: "IAM",
      status: "failed",
      queuedAt: new Date(Date.now() - 1000 * 60 * 8)
    }
  ]);

  const { toast } = useToast();

  const filteredOperations = pendingOperations.filter(operation => {
    return operation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           operation.ussdCode.includes(searchTerm) ||
           operation.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           operation.operator.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusBadge = (status: PendingOperation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'executing':
        return <Badge variant="primary" className="gap-1"><RefreshCw className="h-3 w-3 animate-spin" />Executing</Badge>;
      case 'completed':
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">USSD Operations</h1>
              <p className="text-muted-foreground">Monitor pending USSD executions across devices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="execute" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="execute" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Execute USSD
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Operations
            </TabsTrigger>
          </TabsList>

          {/* Execute USSD Tab */}
          <TabsContent value="execute">
            <USSDExecutor />
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search operations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Pending Operations Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Operations ({filteredOperations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>USSD Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>SIM Card</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Queued</TableHead>
                        <TableHead>ETA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOperations.map((operation) => (
                        <TableRow key={operation.id}>
                          <TableCell>
                            <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                              {operation.ussdCode}
                            </code>
                          </TableCell>
                          <TableCell className="font-medium">{operation.description}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                            {operation.deviceName}
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            {operation.simCard}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{operation.operator}</Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(operation.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {operation.queuedAt.toLocaleTimeString()}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {operation.estimatedTime || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
