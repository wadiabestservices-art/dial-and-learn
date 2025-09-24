import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Smartphone, CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { USSDMenu } from "./USSDMenu";

interface Device {
  id: string;
  name: string;
  simCards: { slot: string; operator: string; }[];
}

interface USSDResponse {
  sessionId: string;
  message: string;
  isMenu: boolean;
  options?: { key: string; text: string; }[];
  canGoBack?: boolean;
}

export const USSDExecutor = () => {
  const [ussdCode, setUssdCode] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [selectedSim, setSelectedSim] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<USSDResponse | null>(null);
  const { toast } = useToast();

  // Mock devices
  const devices: Device[] = [
    {
      id: "1",
      name: "Samsung Galaxy A54", 
      simCards: [
        { slot: "Slot 1", operator: "MTN" },
        { slot: "Slot 2", operator: "Vodacom" }
      ]
    },
    {
      id: "2", 
      name: "iPhone 14",
      simCards: [
        { slot: "eSIM 1", operator: "Vodacom" },
        { slot: "Physical SIM", operator: "Cell C" }
      ]
    },
    {
      id: "3",
      name: "Xiaomi Redmi Note 12",
      simCards: [
        { slot: "Slot 1", operator: "Cell C" },
        { slot: "Slot 2", operator: "Telkom" }
      ]
    }
  ];

  // Mock USSD responses
  const getMockUSSDResponse = (code: string, operator: string): USSDResponse => {
    const sessionId = `session_${Date.now()}`;
    
    const responses: Record<string, USSDResponse> = {
      "*123#": {
        sessionId,
        message: `Welcome to ${operator}\n\nYour balance: R45.50\nExpiry: 30 days\n\n1. Buy airtime\n2. Buy data\n3. Transfer airtime\n4. My account\n0. Exit`,
        isMenu: true,
        options: [
          { key: "1", text: "Buy airtime" },
          { key: "2", text: "Buy data" },
          { key: "3", text: "Transfer airtime" },
          { key: "4", text: "My account" },
          { key: "0", text: "Exit" }
        ]
      },
      "*131#": {
        sessionId,
        message: `${operator} Data Services\n\nData balance: 2.5GB\nExpiry: 15 days\n\n1. Buy data bundle\n2. Data usage history\n3. Share data\n4. Data settings\n0. Exit`,
        isMenu: true,
        options: [
          { key: "1", text: "Buy data bundle" },
          { key: "2", text: "Data usage history" },
          { key: "3", text: "Share data" },
          { key: "4", text: "Data settings" },
          { key: "0", text: "Exit" }
        ]
      },
      "*100#": {
        sessionId,
        message: `${operator} Airtime Top-up\n\n1. Buy for myself\n2. Buy for someone else\n3. Airtime voucher\n4. Check recent purchases\n0. Main menu`,
        isMenu: true,
        options: [
          { key: "1", text: "Buy for myself" },
          { key: "2", text: "Buy for someone else" },
          { key: "3", text: "Airtime voucher" },
          { key: "4", text: "Check recent purchases" },
          { key: "0", text: "Main menu" }
        ]
      },
      "*555#": {
        sessionId,
        message: "Please Call Me service activated successfully!\n\nYour request has been sent.",
        isMenu: false
      }
    };

    return responses[code] || {
      sessionId,
      message: `USSD code ${code} executed successfully on ${operator} network.\n\nService not available at the moment.\nPlease try again later.`,
      isMenu: false
    };
  };

  const executeUSSD = async () => {
    if (!ussdCode || !selectedDevice || !selectedSim) {
      toast({
        title: "Missing Information",
        description: "Please select device, SIM card and enter USSD code",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    setCurrentResponse(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const device = devices.find(d => d.id === selectedDevice);
      const simCard = device?.simCards.find(s => s.slot === selectedSim);
      const operator = simCard?.operator || "Unknown";
      
      const response = getMockUSSDResponse(ussdCode, operator);
      setCurrentResponse(response);
      
      toast({
        title: "USSD Executed",
        description: `Code ${ussdCode} executed on ${device?.name} - ${selectedSim}`,
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to execute USSD code",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleMenuOption = async (option: string) => {
    if (!currentResponse) return;

    setIsExecuting(true);
    
    // Simulate menu navigation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock submenu responses
    const device = devices.find(d => d.id === selectedDevice);
    const simCard = device?.simCards.find(s => s.slot === selectedSim);
    const operator = simCard?.operator || "Unknown";
    
    let newResponse: USSDResponse;
    
    if (option === "0") {
      setCurrentResponse(null);
      setIsExecuting(false);
      toast({
        title: "Session Ended",
        description: "USSD session terminated"
      });
      return;
    }

    // Generate submenu based on selection
    if (option === "1" && ussdCode === "*123#") {
      newResponse = {
        sessionId: currentResponse.sessionId,
        message: `${operator} Airtime Purchase\n\n1. R5\n2. R10\n3. R20\n4. R50\n5. R100\n9. Back\n0. Exit`,
        isMenu: true,
        options: [
          { key: "1", text: "R5" },
          { key: "2", text: "R10" },
          { key: "3", text: "R20" },
          { key: "4", text: "R50" },
          { key: "5", text: "R100" },
          { key: "9", text: "Back" },
          { key: "0", text: "Exit" }
        ],
        canGoBack: true
      };
    } else if (option === "1" && ussdCode === "*131#") {
      newResponse = {
        sessionId: currentResponse.sessionId,
        message: `${operator} Data Bundles\n\n1. Daily bundles\n2. Weekly bundles\n3. Monthly bundles\n4. Social bundles\n9. Back\n0. Exit`,
        isMenu: true,
        options: [
          { key: "1", text: "Daily bundles" },
          { key: "2", text: "Weekly bundles" },
          { key: "3", text: "Monthly bundles" },
          { key: "4", text: "Social bundles" },
          { key: "9", text: "Back" },
          { key: "0", text: "Exit" }
        ],
        canGoBack: true
      };
    } else {
      newResponse = {
        sessionId: currentResponse.sessionId,
        message: `Option ${option} selected.\n\nFeature coming soon!\n\nThank you for using ${operator} services.`,
        isMenu: false
      };
    }
    
    setCurrentResponse(newResponse);
    setIsExecuting(false);
  };

  const selectedDeviceData = devices.find(d => d.id === selectedDevice);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Execute USSD Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Device Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Device</label>
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger>
                <SelectValue placeholder="Choose device" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      {device.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SIM Card Selection */}
          {selectedDeviceData && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select SIM Card</label>
              <Select value={selectedSim} onValueChange={setSelectedSim}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose SIM card" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDeviceData.simCards.map((sim, index) => (
                    <SelectItem key={index} value={sim.slot}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        {sim.slot} - <Badge variant="outline" className="ml-1">{sim.operator}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* USSD Code Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">USSD Code</label>
            <Input
              placeholder="e.g., *123#"
              value={ussdCode}
              onChange={(e) => setUssdCode(e.target.value)}
              className="font-mono"
            />
          </div>

          {/* Execute Button */}
          <Button 
            onClick={executeUSSD} 
            disabled={isExecuting || !ussdCode || !selectedDevice || !selectedSim}
            className="w-full"
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Phone className="h-4 w-4 mr-2" />
            )}
            {isExecuting ? "Executing..." : "Execute USSD"}
          </Button>
        </CardContent>
      </Card>

      {/* USSD Response */}
      {currentResponse && (
        <USSDMenu 
          response={currentResponse} 
          onSelectOption={handleMenuOption}
          isLoading={isExecuting}
        />
      )}
    </div>
  );
};