import React from "react";
import { DateTime } from "luxon";
import { IvnStat } from "services/vnstat.type";
import useHelpers from "hooks/useHelpers";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Line,
  LineChart,
  ReferenceLine
} from "recharts";
import useSettings from "hooks/useSettings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";


const Chart = ({ type, traffic }: Props) => {
  const { settings } = useSettings();
  const { formatTraffic } = useHelpers();
  const [historyOption, setHistoryOption] = React.useState<string>("default");
  const [show95thPercentile, setShow95thPercentile] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHistoryOption("default");
  }, [type]);

  const getHistoryOptions = () => {
    switch (type) {
      case "fiveminute":
        return [
          { value: "default", label: "Last 24h" },
          { value: "6h", label: "Last 6h" },
          { value: "12h", label: "Last 12h" },
          { value: "48h", label: "Last 48h" },
          { value: "72h", label: "Last 72h" },
          { value: "all", label: "All" },
        ];
      case "hour":
        return [
          { value: "default", label: "Last 48h" },
          { value: "24h", label: "Last 24h" },
          { value: "72h", label: "Last 72h" },
          { value: "7d", label: "Last 7 Days" },
          { value: "14d", label: "Last 14 Days" },
          { value: "30d", label: "Last 30 Days" },
          { value: "all", label: "All" },
        ];
      case "day":
        return [
          { value: "default", label: "Last 30 Days" },
          { value: "7d", label: "Last 7 Days" },
          { value: "14d", label: "Last 14 Days" },
          { value: "90d", label: "Last 90 Days" },
          { value: "all", label: "All" },
        ];
      case "month":
        return [
          { value: "default", label: "Last 12 Months" },
          { value: "6m", label: "Last 6 Months" },
          { value: "24m", label: "Last 24 Months" },
          { value: "all", label: "All" },
        ];
      case "year":
        return [
          { value: "default", label: "Last 10 Years" },
          { value: "5y", label: "Last 5 Years" },
          { value: "all", label: "All" },
        ];
      default:
        return [];
    }
  };

  const data = React.useMemo(() => {
    return traffic.map((item) => ({
      ...item,
      dateObj: DateTime.fromObject({ ...item.date, ...item.time }).toJSDate(),
      rateMbit: item.rate ? item.rate / 1000000 : 0 // Mbit/s
    }));
  }, [traffic]);

  const formatXAxis = (tickItem: Date) => {
    const date = DateTime.fromJSDate(tickItem);
    switch (type) {
      case "fiveminute":
      case "hour":
        return date.toLocaleString(DateTime.TIME_SIMPLE);
      case "day":
        return date.toFormat("d");
      case "month":
        return date.toFormat("MMM");
      case "year":
        return date.toFormat("yyyy");
      default:
        return "";
    }
  };

  const formatTooltipDate = (tickItem: Date) => {
    const date = DateTime.fromJSDate(tickItem);
    switch (type) {
      case "fiveminute":
      case "hour":
        return date.toLocaleString(DateTime.DATETIME_SHORT);
      case "day":
        return date.toLocaleString(DateTime.DATE_SHORT);
      case "month":
        return date.toFormat("MMMM yyyy");
      case "year":
        return date.toFormat("yyyy");
      default:
        return "";
    }
  };

  const chartData = React.useMemo(() => {
    let limit = data.length;

    if (historyOption === "all") {
      limit = data.length;
    } else {
      switch (type) {
        case "fiveminute":
          if (historyOption === "6h") limit = 72;
          else if (historyOption === "12h") limit = 144;
          else if (historyOption === "48h") limit = 576;
          else if (historyOption === "72h") limit = 864;
          else limit = 288; // 24h default
          break;
        case "hour":
          if (historyOption === "24h") limit = 24;
          else if (historyOption === "72h") limit = 72;
          else if (historyOption === "7d") limit = 168;
          else if (historyOption === "14d") limit = 336;
          else if (historyOption === "30d") limit = 720;
          else limit = 48; // default
          break;
        case "day":
          if (historyOption === "7d") limit = 7;
          else if (historyOption === "14d") limit = 14;
          else if (historyOption === "90d") limit = 90;
          else limit = 30; // default
          break;
        case "month":
          if (historyOption === "6m") limit = 6;
          else if (historyOption === "24m") limit = 24;
          else limit = 12; // default
          break;
        case "year":
          if (historyOption === "5y") limit = 5;
          else limit = 10; // default
          break;
      }
    }

    return data.slice(Math.max(data.length - limit, 0));
  }, [data, type, historyOption]);

    const percentile95 = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return 0;
    const rates = chartData.map(d => d.rateMbit).sort((a, b) => a - b);
    const index = Math.floor(0.95 * rates.length);
    return rates[index];
  }, [chartData]);

  const name = `chart_${type}_type` as keyof typeof settings;
  const isBar = settings[name] === "bar";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border p-3 rounded shadow-md">
          <p className="mb-2 font-semibold text-sm">{formatTooltipDate(label)}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} style={{ color: p.color }} className="text-sm">
              <span className="font-medium">{p.name}:</span> {p.name === "Rate" ? p.value.toFixed(2) + " Mbit/s" : formatTraffic(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs defaultValue="traffic" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="w-[180px]">
          <Select value={historyOption} onValueChange={setHistoryOption}>
            <SelectTrigger>
              <SelectValue placeholder="Select history limit" />
            </SelectTrigger>
            <SelectContent>
              {getHistoryOptions().map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TabsList>
          <TabsTrigger value="traffic">Traffic Data</TabsTrigger>
          <TabsTrigger value="rate">Mbit/s Rate</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="traffic">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {isBar ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="dateObj" tickFormatter={formatXAxis} minTickGap={30} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(val) => formatTraffic(val)} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="rx" name="RX" fill="#10b981" />
                <Bar dataKey="tx" name="TX" fill="#6366f1" />
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="dateObj" tickFormatter={formatXAxis} minTickGap={30} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(val) => formatTraffic(val)} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="rx" name="RX" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="tx" name="TX" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="rate">
        <div className="flex items-center justify-end space-x-2 mb-2">
          <Switch
            id="percentile-toggle"
            checked={show95thPercentile}
            onCheckedChange={setShow95thPercentile}
          />
          <Label htmlFor="percentile-toggle" className="text-sm text-muted-foreground cursor-pointer">
            Show 95th Percentile
          </Label>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="dateObj" tickFormatter={formatXAxis} minTickGap={30} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(val) => val.toFixed(1) + " Mb/s"} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="rateMbit" name="Rate" stroke="#f59e0b" strokeWidth={2} dot={false} />
              {show95thPercentile && (
                <ReferenceLine
                  y={percentile95}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={(props) => {
                    const { viewBox } = props;
                    return (
                      <g>
                        <rect x={viewBox.x + viewBox.width / 2 - 100} y={viewBox.y - 20} width={200} height={20} fill="white" opacity={0.8} rx={4} ry={4} />
                        <text x={viewBox.x + viewBox.width / 2} y={viewBox.y - 5} fill="#ef4444" fontSize={12} textAnchor="middle">
                          {`95th Percentile (${percentile95.toFixed(2)} Mb/s)`}
                        </text>
                      </g>
                    );
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default Chart;

type Props = {
  type: IvnStat.TrafficKeys;
  traffic: IvnStat.Traffic[];
};
