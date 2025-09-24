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
        { slot: "Slot 1", operator: "Inwi" },
        { slot: "Slot 2", operator: "Orange" }
      ]
    },
    {
      id: "2", 
      name: "iPhone 14",
      simCards: [
        { slot: "eSIM 1", operator: "IAM" },
        { slot: "Physical SIM", operator: "Orange" }
      ]
    },
    {
      id: "3",
      name: "Xiaomi Redmi Note 12",
      simCards: [
        { slot: "Slot 1", operator: "Inwi" },
        { slot: "Slot 2", operator: "IAM" }
      ]
    }
  ];

  // Mock USSD responses
  const getMockUSSDResponse = (code: string, operator: string): USSDResponse => {
    const sessionId = `session_${Date.now()}`;
    
    const responses: Record<string, USSDResponse> = {
      "*123#": {
        sessionId,
        message: `Welcome to ${operator}\n\nAccount Activation Menu\n\n1. New line activation\n2. SIM card activation\n3. Service activation\n4. Check activation status\n0. Exit`,
        isMenu: true,
        options: [
          { key: "1", text: "New line activation" },
          { key: "2", text: "SIM card activation" },
          { key: "3", text: "Service activation" },
          { key: "4", text: "Check activation status" },
          { key: "0", text: "Exit" }
        ]
      },
      "*131#": {
        sessionId,
        message: `${operator} Data Topup\n\nSelect data package:\n\n1. 1GB - 10 MAD\n2. 5GB - 40 MAD\n3. 10GB - 70 MAD\n4. Unlimited - 100 MAD\n0. Exit`,
        isMenu: true,
        options: [
          { key: "1", text: "1GB - 10 MAD" },
          { key: "2", text: "5GB - 40 MAD" },
          { key: "3", text: "10GB - 70 MAD" },
          { key: "4", text: "Unlimited - 100 MAD" },
          { key: "0", text: "Exit" }
        ]
      },
      "*100#": {
        sessionId,
        message: `${operator} Airtime Topup\n\n1. 10 MAD\n2. 20 MAD\n3. 50 MAD\n4. 100 MAD\n5. 200 MAD\n0. Main menu`,
        isMenu: true,
        options: [
          { key: "1", text: "10 MAD" },
          { key: "2", text: "20 MAD" },
          { key: "3", text: "50 MAD" },
          { key: "4", text: "100 MAD" },
          { key: "5", text: "200 MAD" },
          { key: "0", text: "Main menu" }
        ]
      },
      "*222#": {
        sessionId,
        message: `${operator} Bundle Topup\n\n1. Voice bundle\n2. SMS bundle\n3. Data bundle\n4. Mixed bundle\n0. Exit`,
        isMenu: true,
        options: [
          { key: "1", text: "Voice bundle" },
          { key: "2", text: "SMS bundle" },
          { key: "3", text: "Data bundle" },
          { key: "4", text: "Mixed bundle" },
          { key: "0", text: "Exit" }
        ]
      },
      "*321#": {
        sessionId,
        message: `${operator} Line Activation\n\nYour line activation is in progress.\n\nActivation will be completed within 24 hours.\n\nThank you for choosing ${operator}.`,
        isMenu: false
      },
      "*555#": {
        sessionId,
        message: `${operator} Service Activation\n\n1. International roaming\n2. Call forwarding\n3. Voicemail\n4. SMS notifications\n0. Exit`,
        isMenu: true,
        options: [
          { key: "1", text: "International roaming" },
          { key: "2", text: "Call forwarding" },
          { key: "3", text: "Voicemail" },
          { key: "4", text: "SMS notifications" },
          { key: "0", text: "Exit" }
        ]
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