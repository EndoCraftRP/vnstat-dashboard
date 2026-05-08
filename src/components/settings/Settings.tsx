import React from "react";
import useSettings, { ISettings } from "hooks/useSettings";
import useLanguages from "hooks/useLanguages";
import { IModal } from "hooks/useModal";
import FieldChart from "./FieldChart";
import { Button } from "components/ui/button";
import useHelpers from "hooks/useHelpers";
import { DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Label } from "components/ui/label";

const Settings = ({ close }: Props) => {
  const { __ } = useLanguages();
  const { settings, setSettings } = useSettings();
  const { getUnitOptions } = useHelpers();
  const [form, setForm] = React.useState<ISettings.Options>(settings);

  let units: any[] = [];
  getUnitOptions().forEach((value) => {
    units.push({
      value: value.name,
      label: value.name + " (" + value.bytes[1] + ", " + value.bits[1] + ")",
    });
  });

  let initials = [
    { value: "fiveminute", label: __("Minutes") },
    { value: "hour", label: __("Hours") },
    { value: "day", label: __("Days") },
    { value: "month", label: __("Months") },
    { value: "year", label: __("Years") },
  ];

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSettings(form);
    close();
  }

  const field = { form, setForm };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{__("Settings")}</DialogTitle>
      </DialogHeader>
      <form name="settings" onSubmit={onSubmit} className="flex flex-col gap-6 py-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label>Units</Label>
            <Select value={form.units} onValueChange={(val: any) => setForm(p => ({ ...p, units: val }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Theme</Label>
            <Select value={form.theme || "dark"} onValueChange={(val: any) => {
                setForm(p => ({ ...p, theme: val }));
                if (val === "dark") document.documentElement.classList.add("dark");
                else document.documentElement.classList.remove("dark");
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Initial report</Label>
            <Select value={form.reports_initial} onValueChange={(val: any) => setForm(p => ({ ...p, reports_initial: val }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">{__("Top")}</SelectItem>
                {initials.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Initial chart</Label>
            <Select value={form.chart_initial} onValueChange={(val: any) => setForm(p => ({ ...p, chart_initial: val }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {initials.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <h3 className="font-semibold mb-4 text-lg">Charts Config</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldChart label="Minutes" type="fiveminute" {...field} />
            <FieldChart label="Hours" type="hour" {...field} />
            <FieldChart label="Days" type="day" {...field} />
            <FieldChart label="Months" type="month" {...field} />
            <FieldChart label="Years" type="year" {...field} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" type="button" onClick={() => close()}>
            {__("Cancel")}
          </Button>
          <Button type="submit">{__("Save")}</Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default Settings;

type Props = {
  close: IModal.Props["close"];
};
