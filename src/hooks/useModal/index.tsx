import React from "react";
import ReactDOM from "react-dom";
import { Dialog, DialogOverlay, DialogPortal } from "components/ui/dialog";

const useModal = (
  children: React.FunctionComponent<IModal.Props>,
  options: IModal.Options = {},
  props: IModal.Props = {
    close: () => {},
  }
): IModal.Return => {
  const [open, setOpen] = React.useState(false);

  options = {
    name: "name",
    ...options,
  };

  props.close = closeModal;

  function toggle(): void {
    setOpen(!open);
  }

  function closeModal(): void {
    setOpen(false);
  }

  const ModalComponent = open ? ReactDOM.createPortal(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="z-50" />
        {React.createElement(children, props)}
      </DialogPortal>
    </Dialog>,
    document.body
  ) : null;

  return [ModalComponent, toggle];
};

export default useModal;

export namespace IModal {
  export interface Options {
    name?: string;
  }

  export interface Props {
    close: () => void;
    [key: string]: any;
  }

  export type Return = [React.ReactNode, () => void];
}
