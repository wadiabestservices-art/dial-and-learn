import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, ArrowLeft, X } from "lucide-react";

interface USSDResponse {
  sessionId: string;
  message: string;
  isMenu: boolean;
  options?: { key: string; text: string; }[];
  canGoBack?: boolean;
}

interface USSDMenuProps {
  response: USSDResponse;
  onSelectOption: (option: string) => void;
  isLoading?: boolean;
}

export const USSDMenu = ({ response, onSelectOption, isLoading }: USSDMenuProps) => {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            USSD Response
          </div>
          <Badge variant="outline" className="text-xs">
            Session: {response.sessionId.slice(-8)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Response Message */}
        <div className="bg-muted/50 p-4 rounded-lg border">
          <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
            {response.message}
          </pre>
        </div>

        {/* Menu Options */}
        {response.isMenu && response.options && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Select an option:
            </h4>
            <div className="grid gap-2">
              {response.options.map((option) => (
                <Button
                  key={option.key}
                  variant={option.key === "0" ? "destructive" : 
                          option.key === "9" ? "secondary" : "outline"}
                  className="justify-start text-left h-auto p-3"
                  onClick={() => onSelectOption(option.key)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <span className="font-mono text-sm bg-background px-2 py-1 rounded mr-3 min-w-[24px] text-center">
                      {option.key}
                    </span>
                  )}
                  <span className="flex-1">{option.text}</span>
                  {option.key === "9" && <ArrowLeft className="h-4 w-4 ml-2" />}
                  {option.key === "0" && <X className="h-4 w-4 ml-2" />}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Non-menu response actions */}
        {!response.isMenu && (
          <div className="flex justify-end pt-2">
            <Button 
              variant="outline" 
              onClick={() => onSelectOption("0")}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};