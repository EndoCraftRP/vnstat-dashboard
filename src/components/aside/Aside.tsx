import React from "react";
import Widget from "../widget/Widget";
import Estimated from "./Estimated";
import Average from "./Average";
import useLanguages from "hooks/useLanguages";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

const Aside = () => {
  const { __ } = useLanguages();

  return (
    <Widget>
      <Tabs defaultValue="estimated" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="estimated">{__("Estimated")}</TabsTrigger>
          <TabsTrigger value="average">{__("Average")}</TabsTrigger>
        </TabsList>
        <TabsContent value="estimated" className="flex flex-col gap-6">
          <Estimated />
        </TabsContent>
        <TabsContent value="average" className="flex flex-col gap-6">
          <Average />
        </TabsContent>
      </Tabs>
    </Widget>
  );
};

export default Aside;
