import useReports from "hooks/useReports";

const Logo = () => {
  const { json } = useReports();
  const version = json?.getVersion() || "";

  return (
    <div className="flex items-baseline gap-2">
      <h1 className="text-3xl font-light m-0">vnStat</h1>
      {version && <small className="text-muted-foreground text-xs">v{version}</small>}
    </div>
  );
};

export default Logo;
