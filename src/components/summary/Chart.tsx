import React from "react";
import { DateTime } from "luxon";
import useLanguages from "hooks/useLanguages";
import { IvnStat } from "services/vnstat.type";
import { Progress } from "components/ui/progress";

const Chart = ({ name, item, higher }: Props) => {
  const { __ } = useLanguages();

  let title: string | null = "-";

  switch (name) {
    case "dayA":
    case "dayB":
      if ("date" in item)
        title = DateTime.fromObject({ ...item.date }).toRelativeCalendar();
      break;
    case "monthA":
    case "monthB":
      if ("date" in item)
        title = DateTime.fromObject({ ...item.date }).monthLong;
      break;
    case "total":
      title = __("Total");
      break;
    default:
      title = "–";
  }

  const rxPercent = higher > 0 ? (item.rx / higher) * 100 : 0;
  const txPercent = higher > 0 ? (item.tx / higher) * 100 : 0;

  return (
    <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-lg">
      <h3 className="text-sm font-medium capitalize text-muted-foreground">{title}</h3>
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span>RX</span>
            <span>{item.rx_formatted}</span>
          </div>
          <Progress value={rxPercent} className="h-2 bg-muted" indicatorClassName="bg-emerald-500" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span>TX</span>
            <span>{item.tx_formatted}</span>
          </div>
          <Progress value={txPercent} className="h-2 bg-muted" indicatorClassName="bg-indigo-500" />
        </div>
        <div className="flex justify-between text-sm font-semibold mt-1">
          <span>Total</span>
          <span>{item.total_formatted}</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;

interface Props {
  name: string;
  item: IvnStat.Traffic | IvnStat.Total;
  higher: number;
}
