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
  LineChart
} from "recharts";
import useSettings from "hooks/useSettings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "components/ui/tabs";

const Chart = ({ type, traffic }: Props) => {
  const { settings } = useSettings();
  const { formatTraffic } = useHelpers();

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
    switch (type) {
      case "fiveminute": limit = 288; break; // 24h
      case "hour": limit = 48; break;
      case "day": limit = 30; break;
      case "month": limit = 12; break;
      case "year": limit = 10; break;
    }
    return data.slice(Math.max(data.length - limit, 0));
  }, [data, type]);

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
      <div className="flex justify-end mb-4">
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
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="dateObj" tickFormatter={formatXAxis} minTickGap={30} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(val) => val.toFixed(1) + " Mb/s"} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="rateMbit" name="Rate" stroke="#f59e0b" strokeWidth={2} dot={false} />
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
