import React from "react";
import { LanguagesProvider } from "hooks/useLanguages";
import { ReportsProvider } from "hooks/useReports";
import { SettingsProvider } from "hooks/useSettings";

const AppProviders = ({ children }: Provider) => {
  return (
    <SettingsProvider>
      <LanguagesProvider>
        <ReportsProvider>{children}</ReportsProvider>
      </LanguagesProvider>
    </SettingsProvider>
  );
};

export default AppProviders;

type Provider = {
  children: React.ReactNode;
};
