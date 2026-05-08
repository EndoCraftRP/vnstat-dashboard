import React from "react";
import useReports from "hooks/useReports";
import useLanguages from "hooks/useLanguages";
import useSettings from "hooks/useSettings";
import { ReportsContext } from "./ReportsContext";
import Widget from "../widget/Widget";
import Cards from "./Cards";
import { IvnStat } from "services/vnstat.type";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";

const Reports = () => {
  const { __ } = useLanguages();
  const { reports } = useReports();
  const { settings } = useSettings();
  const { tab, setTab } = React.useContext(ReportsContext);

  const type = tab ?? settings.reports_initial;
  const traffic = reports.getTraffic(type);

  const menu = [
    { type: "top", title: __("Top") },
    { type: "fiveminute", title: __("Minutes") },
    { type: "hour", title: __("Hours") },
    { type: "day", title: __("Days") },
    { type: "month", title: __("Months") },
    { type: "year", title: __("Years") },
  ];

  return (
    <Widget>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-medium mb-4 sm:mb-0">{__("Reports")}</h2>
        <Tabs value={type} onValueChange={(val: any) => setTab(val)}>
          <TabsList>
            {menu.map((item) => (
              <TabsTrigger key={item.type} value={item.type}>
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <Cards type={type} traffic={traffic} />
    </Widget>
  );
};

export default Reports;
