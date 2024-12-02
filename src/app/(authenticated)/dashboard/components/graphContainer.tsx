// components/GraphContainer.tsx
import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface GraphContainerProps {
  title: string;
  children: ReactNode;
}

function GraphContainer({ title, children }: GraphContainerProps) {
  return (
    <Card className="h-full max-h-[478px] flex flex-col justify-between p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">{children}</CardContent>
    </Card>
  );
}

export default GraphContainer;
