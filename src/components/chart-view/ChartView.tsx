import React from "react";
import useReports from "hooks/useReports";
import useLanguages from "hooks/useLanguages";
import useSettings from "hooks/useSettings";
import { ReportsContext, ReportsContextTab } from "../reports/ReportsContext";
import Widget from "../widget/Widget";
import Chart from "./Chart";
import { IvnStat } from "services/vnstat.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

const ChartView = () => {
  const { __ } = useLanguages();
  const { reports } = useReports();
  const { settings } = useSettings();
  const { tab, setTab } = React.useContext(ReportsContext);

  let lastType = React.useRef<ReportsContextTab>();
  let type: ReportsContextTab = tab ?? settings.chart_initial;
  const traffic = reports.getAllTraffic(true);
  const iface = reports.getInterface();

  let menu: Menu[] = [
    { type: "fiveminute", title: __("Minutes") },
    { type: "hour", title: __("Hours") },
    { type: "day", title: __("Days") },
    { type: "month", title: __("Months") },
    { type: "year", title: __("Years") },
  ];

  menu = menu.filter((item) => {
    const key = item.type;
    return traffic[key].length > 1;
  });

  // Check available type to maintain it on renders
  const exists = menu.findIndex((el) => el.type === type);
  if (exists === -1) type = lastType.current ?? "fiveminute";
  else lastType.current = type;

  return (
    <ChartViewRender
      menu={menu}
      type={type}
      traffic={traffic}
      setTab={setTab}
      iface={iface}
    />
  );
};

const ChartViewRender = React.memo(
  ({ menu, type, traffic, setTab }: RenderProps) => {
    const [chartMode, setChartMode] = React.useState<string>("traffic");
    return (
    <Widget>
      <Tabs value={type} onValueChange={(val: any) => setTab(val)}>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-xl font-medium mb-4 sm:mb-0">Traffic Chart</h2>
          <TabsList>
            {menu.map((item) => (
              <TabsTrigger key={item.type} value={item.type}>
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {menu.map((item) => (
          <TabsContent key={item.type} value={item.type}>
            <Chart type={item.type} traffic={traffic[item.type]} chartMode={chartMode} setChartMode={setChartMode} />
          </TabsContent>
        ))}
      </Tabs>
    </Widget>
  )},
  (prev, next) => {
    if (next.iface !== prev.iface) return false;
    if (next.type === prev.type) return true;
    return false;
  }
);

export default ChartView;

interface RenderProps {
  menu: Menu[];
  type: IvnStat.TrafficKeys;
  traffic: IvnStat.Traffics;
  iface: string;
  setTab: React.Dispatch<React.SetStateAction<ReportsContextTab>>;
}

interface Menu {
  type: IvnStat.TrafficKeys;
  title: string;
}
