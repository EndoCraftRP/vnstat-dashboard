import React from "react";
import { Card } from "components/ui/card";
import { cn } from "lib/utils";

const Widget = ({ children, className }: IWidget) => {
  return (
    <Card className={cn("p-6", className)}>
      {children}
    </Card>
  );
};

export default Widget;

export interface IWidget {
  children: React.ReactNode;
  className?: string;
}
