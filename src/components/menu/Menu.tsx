import React from "react";
import useLanguages from "hooks/useLanguages";
import useModal from "hooks/useModal";
import useReports from "hooks/useReports";
import useSettings from "hooks/useSettings";
import About from "../about/About";
import Settings from "../settings/Settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Button } from "components/ui/button";

const Menu = () => {
  const { __ } = useLanguages();
  const { reports, changeReports } = useReports();
  const { ifaces, settings, setSettings } = useSettings();

  const [ModalAbout, openAbout] = useModal(About, { name: "about" });
  const [ModalSettings, openSettings] = useModal(Settings, {
    name: "settings",
  });

  if (!ifaces || !reports) return null;

  const currentIface = reports.getInterface();

  return (
    <div className="flex items-center gap-4">
      <Select value={currentIface} onValueChange={changeReports}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Interface" />
        </SelectTrigger>
        <SelectContent>
          {ifaces.map((item) => (
            <SelectItem key={item.name} value={item.name}>
              {item.alias || item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={settings.units} onValueChange={(val: any) => setSettings(prev => ({ ...prev, units: val }))}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Units" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="IEC">IEC (MiB)</SelectItem>
          <SelectItem value="JEDEC">JEDEC (MB)</SelectItem>
          <SelectItem value="SI">SI (MB)</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={() => openSettings()}>
        {__("Settings")}
      </Button>
      <Button variant="ghost" onClick={() => openAbout()}>
        {__("About")}
      </Button>

      {ModalAbout}
      {ModalSettings}
    </div>
  );
};

export default Menu;
