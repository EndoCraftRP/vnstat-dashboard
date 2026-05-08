import React from "react";
import ReportsProvider from "../reports/ReportsContext";
import Logo from "../logo/Logo";
import Menu from "../menu/Menu";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-4 border-b">
      <ReportsProvider>
        <Logo />
        <div className="flex items-center gap-4">
          <Menu />
        </div>
      </ReportsProvider>
    </header>
  );
};

export default Header;
