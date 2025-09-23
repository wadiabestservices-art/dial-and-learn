import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface USSDCode {
  id: string;
  code: string;
  description: string;
  category: string;
  lastResult?: string;
  lastExecuted?: Date;
}

interface USSDCardProps {
  ussdCode: USSDCode;
  onExecute: (code: string) => Promise<string>;
}

export const USSDCard = ({ ussdCode, onExecute }: USSDCardProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      const response = await onExecute(ussdCode.code);
      setResult(response);
      toast({
        title: "USSD Executed",
        description: `Code ${ussdCode.code} executed successfully`,
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to execute USSD code",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(ussdCode.code);
    toast({
      title: "Copied",
      description: "USSD code copied to clipboard",
    });
  };

  const getCategoryColor = (category: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "primary" => {
    switch (category.toLowerCase()) {
      case 'balance':
        return 'success';
      case 'data':
        return 'primary';
      case 'airtime':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{ussdCode.description}</CardTitle>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {ussdCode.code}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Badge variant={getCategoryColor(ussdCode.category)}>
            {ussdCode.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <Button
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full"
            variant="default"
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute USSD
              </>
            )}
          </Button>
          
          {result && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Result:</h4>
              <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                <pre className="text-sm text-success-foreground whitespace-pre-wrap font-mono">
                  {result}
                </pre>
              </div>
            </div>
          )}
          
          {ussdCode.lastExecuted && (
            <p className="text-xs text-muted-foreground">
              Last executed: {ussdCode.lastExecuted.toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};