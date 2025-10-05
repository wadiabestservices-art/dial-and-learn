import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, CreditCard, Loader2 } from "lucide-react";
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
  const [menuHistory, setMenuHistory] = useState<USSDResponse[]>([]);
  const { toast } = useToast();

  // Auto-execute USSD when code ends with #
  useEffect(() => {
    if (ussdCode.endsWith('#') && selectedDevice && selectedSim && !isExecuting && !currentResponse) {
      executeUSSD();
    }
  }, [ussdCode, selectedDevice, selectedSim]);

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
      return;
    }

    setIsExecuting(true);
    setCurrentResponse(null);
    setMenuHistory([]);

    try {
      // Simulate network delay - operator response time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const device = devices.find(d => d.id === selectedDevice);
      const simCard = device?.simCards.find(s => s.slot === selectedSim);
      const operator = simCard?.operator || "Unknown";
      
      const response = getMockUSSDResponse(ussdCode, operator);
      setCurrentResponse(response);
      setMenuHistory([response]);
      
      toast({
        title: `${operator} Response`,
        description: `Connected to ${operator} network`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to operator network",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleMenuOption = async (option: string) => {
    if (!currentResponse) return;

    setIsExecuting(true);
    
    // Simulate operator response time
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const device = devices.find(d => d.id === selectedDevice);
    const simCard = device?.simCards.find(s => s.slot === selectedSim);
    const operator = simCard?.operator || "Unknown";
    
    let newResponse: USSDResponse;
    
    // Handle back navigation
    if (option === "9" && menuHistory.length > 1) {
      const previousMenu = menuHistory[menuHistory.length - 2];
      setCurrentResponse(previousMenu);
      setMenuHistory(menuHistory.slice(0, -1));
      setIsExecuting(false);
      return;
    }
    
    // Handle exit
    if (option === "0") {
      setCurrentResponse(null);
      setMenuHistory([]);
      setIsExecuting(false);
      setUssdCode("");
      toast({
        title: "Session Ended",
        description: `${operator} session closed`
      });
      return;
    }

    // Multi-level menu navigation
    const currentLevel = menuHistory.length;
    
    // Level 1 menus
    if (currentLevel === 1) {
      if (ussdCode === "*123#") {
        if (option === "1") {
          newResponse = {
            sessionId: currentResponse.sessionId,
            message: `${operator} New Line Activation\n\n1. Prepaid activation\n2. Postpaid activation\n3. Corporate activation\n9. Back\n0. Exit`,
            isMenu: true,
            options: [
              { key: "1", text: "Prepaid activation" },
              { key: "2", text: "Postpaid activation" },
              { key: "3", text: "Corporate activation" },
              { key: "9", text: "Back" },
              { key: "0", text: "Exit" }
            ],
            canGoBack: true
          };
        } else if (option === "2") {
          newResponse = {
            sessionId: currentResponse.sessionId,
            message: `${operator} SIM Activation\n\nEnter your 19-digit SIM number to activate.\n\nActivation will be completed within 2 hours.\n\nThank you for choosing ${operator}.`,
            isMenu: false
          };
        } else {
          newResponse = {
            sessionId: currentResponse.sessionId,
            message: `${operator}\n\nOption ${option} selected.\n\nProcessing request...\n\nYou will receive confirmation via SMS.`,
            isMenu: false
          };
        }
      } else if (ussdCode === "*131#") {
        if (option === "1") {
          newResponse = {
            sessionId: currentResponse.sessionId,
            message: `${operator} 1GB Data Package\n\nPrice: 10 MAD\nValidity: 24 hours\n\n1. Confirm purchase\n9. Back\n0. Exit`,
            isMenu: true,
            options: [
              { key: "1", text: "Confirm purchase" },
              { key: "9", text: "Back" },
              { key: "0", text: "Exit" }
            ],
            canGoBack: true
          };
        } else if (option === "2") {
          newResponse = {
            sessionId: currentResponse.sessionId,
            message: `${operator} 5GB Data Package\n\nPrice: 40 MAD\nValidity: 7 days\n\n1. Confirm purchase\n9. Back\n0. Exit`,
            isMenu: true,
            options: [
              { key: "1", text: "Confirm purchase" },
              { key: "9", text: "Back" },
              { key: "0", text: "Exit" }
            ],
            canGoBack: true
          };
        } else {
          newResponse = {
            sessionId: currentResponse.sessionId,
            message: `${operator} Data Package\n\n1. Confirm purchase\n9. Back\n0. Exit`,
            isMenu: true,
            options: [
              { key: "1", text: "Confirm purchase" },
              { key: "9", text: "Back" },
              { key: "0", text: "Exit" }
            ],
            canGoBack: true
          };
        }
      } else {
        newResponse = {
          sessionId: currentResponse.sessionId,
          message: `${operator}\n\nOption ${option} processed.\n\nThank you for using ${operator} services.`,
          isMenu: false
        };
      }
    } 
    // Level 2+ menus (confirmations, etc)
    else {
      if (option === "1") {
        newResponse = {
          sessionId: currentResponse.sessionId,
          message: `${operator}\n\nTransaction successful!\n\nYou will receive a confirmation SMS shortly.\n\nThank you!`,
          isMenu: false
        };
      } else {
        newResponse = {
          sessionId: currentResponse.sessionId,
          message: `${operator}\n\nRequest processed.\n\nThank you for using ${operator}.`,
          isMenu: false
        };
      }
    }
    
    setCurrentResponse(newResponse);
    setMenuHistory([...menuHistory, newResponse]);
    setIsExecuting(false);
  };

  const selectedDeviceData = devices.find(d => d.id === selectedDevice);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            USSD Dialer
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
            <div className="relative">
              <Input
                placeholder="Type code and press # to dial..."
                value={ussdCode}
                onChange={(e) => setUssdCode(e.target.value)}
                disabled={isExecuting || !selectedDevice || !selectedSim}
                className="font-mono text-lg pr-10"
                autoComplete="off"
              />
              {isExecuting && (
                <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {!selectedDevice || !selectedSim 
                ? "Select device and SIM card first" 
                : "Auto-dials when you type # at the end"}
            </p>
          </div>
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