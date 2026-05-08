import { IModal } from "hooks/useModal";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "components/ui/dialog";

const About = ({ close }: Props) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>vnStat Dashboard</DialogTitle>
        <DialogDescription>
          v0.2.2 - Created by Edir Pedro
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4">
        <p className="text-sm">
          A modern, beautiful interface for vnStat data. This project is a visualization tool that processes
          vnStat JSON output to present easy-to-understand metrics and charts.
        </p>
        <p className="text-sm font-medium">
          <a href="https://github.com/edirpedro/vnstat-dashboard" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            GitHub Repository
          </a>
        </p>
      </div>
    </DialogContent>
  );
};

export default About;

type Props = {
  close: IModal.Props["close"];
};
