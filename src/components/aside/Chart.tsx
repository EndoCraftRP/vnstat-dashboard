import useHelpers from "hooks/useHelpers";
import { Progress } from "components/ui/progress";

const Chart = ({ rx, tx, title }: ChartProps) => {
  const { formatTraffic } = useHelpers();
  const max = Math.max(rx, tx) * 1.5; // Scale up a bit so bars aren't always 100% full
  const calcRX = max > 0 ? (rx / max) * 100 : 0;
  const calcTX = max > 0 ? (tx / max) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-card/50">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span>RX</span>
            <span className="text-emerald-500 font-medium">{formatTraffic(rx)}</span>
          </div>
          <Progress value={calcRX} className="h-1.5" indicatorClassName="bg-emerald-500" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span>TX</span>
            <span className="text-indigo-500 font-medium">{formatTraffic(tx)}</span>
          </div>
          <Progress value={calcTX} className="h-1.5" indicatorClassName="bg-indigo-500" />
        </div>
        <div className="flex justify-between text-sm pt-2 mt-2 border-t font-semibold">
          <span>Total</span>
          <span>{formatTraffic(rx + tx)}</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;

export interface ChartProps {
  type: string;
  title: string;
  rx: number;
  tx: number;
}
