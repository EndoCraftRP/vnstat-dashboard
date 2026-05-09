import { DateTime } from "luxon";
import { IvnStat } from "services/vnstat.type";
import { Progress } from "components/ui/progress";

const Card = ({ type, item, index, max }: Props) => {
  function theTitle(): string {
    const date = DateTime.fromObject({ ...item.date, ...item.time });
    switch (type) {
      case "fiveminute":
      case "hour":
        return date.toLocaleString(DateTime.TIME_SIMPLE);
      case "day":
        return date.day.toString();
      case "month":
        return date.monthLong ?? "";
      case "year":
        return date.year.toString();
      case "top":
        return date.toLocaleString(DateTime.DATE_SHORT);
      default:
        return "";
    }
  }

  const rxPercent = max > 0 ? (item.rx / max) * 100 : 0;
  const txPercent = max > 0 ? (item.tx / max) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr_100px_100px_100px_100px] gap-2 sm:gap-4 px-4 py-3 text-sm items-center hover:bg-muted/30 transition-colors">
      <div className="font-medium flex items-center gap-2">
        {type === "top" ? (
          <span className="text-muted-foreground">{(index + 1).toString().padStart(2, "0")}</span>
        ) : null}
        {theTitle()}
      </div>

      <div className="hidden sm:flex flex-col gap-1 w-full max-w-[200px]">
        <Progress value={rxPercent} className="h-1.5" indicatorClassName="bg-emerald-500" />
        <Progress value={txPercent} className="h-1.5" indicatorClassName="bg-indigo-500" />
      </div>

      <div className="flex justify-between sm:block text-right">
        <span className="sm:hidden text-muted-foreground mr-2">RX:</span>
        <span className="text-emerald-500">{item.rx_formatted}</span>
      </div>
      <div className="flex justify-between sm:block text-right">
        <span className="sm:hidden text-muted-foreground mr-2">TX:</span>
        <span className="text-indigo-500">{item.tx_formatted}</span>
      </div>
      <div className="flex justify-between sm:block text-right font-medium">
        <span className="sm:hidden text-muted-foreground mr-2">Total:</span>
        <span>{item.total_formatted}</span>
      </div>
      <div className="flex justify-between sm:block text-right text-muted-foreground">
        <span className="sm:hidden mr-2">Rate:</span>
        <span>{item.rate_formatted}</span>
      </div>
    </div>
  );
};

export default Card;

type Props = {
  type: IvnStat.TrafficKeys;
  item: IvnStat.Traffic;
  index: number;
  max: number;
};
