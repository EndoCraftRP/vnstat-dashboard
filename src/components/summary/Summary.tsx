import useReports from "hooks/useReports";
import Widget from "../widget/Widget";
import Chart from "./Chart";

const Summary = () => {
  const { reports } = useReports();

  const zero = { rx: 0, tx: 0 };

  const day = reports.getDay();
  const dA = day.at(-1) ?? zero;
  const dB = day.at(-2) ?? zero;
  const dH = Math.max(dA.rx, dA.tx, dB.rx, dB.tx);

  const month = reports.getMonth();
  const mA = month.at(-1) ?? zero;
  const mB = month.at(-2) ?? zero;
  const mH = Math.max(mA.rx, mA.tx, mB.rx, mB.tx);

  const t = reports.getTotal();
  const tH = Math.max(t.rx, t.tx);

  return (
    <Widget>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Chart name="dayA" item={dA} higher={dH} />
        <Chart name="dayB" item={dB} higher={dH} />
        <Chart name="monthA" item={mA} higher={mH} />
        <Chart name="monthB" item={mB} higher={mH} />
        <Chart name="total" item={t} higher={tH} />
      </div>
    </Widget>
  );
};

export default Summary;
