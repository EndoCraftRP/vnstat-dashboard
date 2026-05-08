import React from "react";
import { IvnStat } from "services/vnstat.type";
import { ISettings } from "hooks/useSettings";
import { Label } from "components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";

const FieldChart = ({ label, type, form, setForm }: Props) => {
  const chartTypeKey = `chart_${type}_type` as keyof ISettings.Options;

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/20">
      <Label className="text-base font-medium">{label}</Label>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Type</Label>
        <Select
          value={form[chartTypeKey] as string}
          onValueChange={(val: any) => setForm(p => ({ ...p, [chartTypeKey]: val }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar</SelectItem>
            <SelectItem value="area">Area</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FieldChart;

type Props = {
  label: string;
  type: IvnStat.TrafficKeys;
  form: ISettings.Options;
  setForm: React.Dispatch<React.SetStateAction<ISettings.Options>>;
};
