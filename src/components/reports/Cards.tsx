import React from "react";
import { DateTime } from "luxon";
import Card from "./Card";
import { IvnStat } from "services/vnstat.type";

const Cards = ({ type, traffic }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const rx = traffic.map((el) => el.rx);
  const tx = traffic.map((el) => el.tx);
  const max = Math.max(...rx, ...tx);

  React.useEffect(() => {
    if (ref.current) ref.current.scrollTo(0, 0);
  });

  function theSubtitle(item: IvnStat.Traffic): string {
    const date = DateTime.fromObject({ ...item.date, ...item.time });
    switch (type) {
      case "fiveminute":
      case "hour":
        return date.toLocaleString(DateTime.DATE_MED);
      case "day":
        return date.monthLong ?? "";
      case "month":
        return date.year.toString();
      default:
        return "";
    }
  }

  let map = traffic.slice();
  let data: any[] = [];
  let subtitle: string;

  if (type === "top") map = map.slice(0, 20);
  else map.reverse();

  map.forEach((item) => {
    let text = theSubtitle(item);
    if (text && text !== subtitle) {
      data.push({ subtitle: text });
      subtitle = text;
    }
    data.push(item);
  });

  return (
    <div className="flex flex-col h-[500px] overflow-y-auto mt-4 pr-2" ref={ref}>
      <div className="hidden sm:grid grid-cols-[100px_1fr_100px_100px_100px_100px] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b sticky top-0 bg-card z-10">
        <div>Date</div>
        <div>Traffic</div>
        <div className="text-right">RX</div>
        <div className="text-right">TX</div>
        <div className="text-right">Total</div>
        <div className="text-right">Rate</div>
      </div>
      <div className="flex flex-col divide-y">
        {data.map((item, index) =>
          "subtitle" in item ? (
            <div
              key={Math.random()}
              className="px-4 py-2 font-semibold text-sm bg-muted/50 sticky top-[37px] z-10"
            >
              {item.subtitle}
            </div>
          ) : (
            <Card
              key={Math.random()}
              type={type}
              item={item}
              index={index}
              max={max}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Cards;

type Props = {
  type: IvnStat.TrafficKeys;
  traffic: IvnStat.Traffic[];
};
