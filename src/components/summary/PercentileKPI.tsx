import React, { useState, useMemo } from "react";
import useReports from "hooks/useReports";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import useLanguages from "hooks/useLanguages";

const PercentileKPI = () => {
  const { reports } = useReports();
  const { __ } = useLanguages();
  const [duration, setDuration] = useState("24h");

  const durations = [
    { value: "24h", label: "Last 24h" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "6m", label: "Last 6 Months" },
    { value: "1y", label: "Last 1 Year" },
  ];

  const percentile95 = useMemo(() => {
    let data: { rate?: number }[] = [];

    switch (duration) {
      case "24h":
        data = reports.getFiveMinute(true).slice(-288);
        break;
      case "7d":
        data = reports.getHour(true).slice(-168);
        break;
      case "30d":
        data = reports.getDay(true).slice(-30);
        break;
      case "6m":
        data = reports.getMonth(true).slice(-6);
        break;
      case "1y":
        data = reports.getYear(true).slice(-1);
        break;
      default:
        data = reports.getDay(true).slice(-30);
    }

    if (data.length === 0) return 0;

    // Sort rates and find the 95th percentile
    const rates = data.map((d) => d.rate || 0).sort((a, b) => a - b);
    const index = Math.floor(0.95 * rates.length);
    return rates[index];
  }, [reports, duration]);

  const formattedRate = (percentile95 / 1000000).toFixed(2) + " Mb/s";

  return (
    <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-lg">
      <h3 className="text-sm font-medium capitalize text-muted-foreground">{__("95th Percentile")}</h3>

      <div className="mt-2 flex flex-col gap-3">
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {durations.map((d) => (
              <SelectItem key={d.value} value={d.value} className="text-xs">
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex justify-center items-center py-2">
          <span className="text-2xl font-bold">{formattedRate}</span>
        </div>
      </div>
    </div>
  );
};

export default PercentileKPI;
