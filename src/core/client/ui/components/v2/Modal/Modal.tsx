import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";

import { withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import Backdrop from "../Backdrop";
import NoScroll from "../NoScroll";
import TrapFocus from "../TrapFocus";
import { useUIContext } from "../UIContext";

import styles from "./Modal.css";

function appendDivNode(window: Window) {
  const div = window.document.createElement("div");
  window.document.body.append(div);
  div.setAttribute("data-portal", "modal");
  return div;
}

/**
 * useDOMNode is a React hook that returns a DOM node
 * to be used as a portal for the modal.
 *
 * @param open whether the modal is open or not.
 */
function useDOMNode(window: Window, open: boolean) {
  const [modalDOMNode, setModalDOMNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (open) {
      const node = appendDivNode(window);
      setModalDOMNode(node);
      return () => {
        node.parentElement!.removeChild(node);
        setModalDOMNode(null);
      };
    }
    return;
  }, [open, window]);
  return modalDOMNode;
}

export interface ModalProps {
  onClose?: (
    event: React.KeyboardEvent | React.MouseEvent,
    reason: "backdropClick" | "escapeKeyDown"
  ) => void;
  onBackdropClick?: React.EventHandler<React.MouseEvent>;
  onEscapeKeyDown?: React.EventHandler<React.KeyboardEvent>;
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  open?: boolean;
  children?: PropTypesOf<typeof TrapFocus>["children"];
  disableScroll?: boolean;
}

const Modal: FunctionComponent<ModalProps> = ({
  classes,
  open,
  onClose,
  className,
  onBackdropClick,
  onEscapeKeyDown,
  children,
  disableScroll = false,
  ...rest
}) => {
  const { window } = useUIContext();
  const rootClassName = cn(classes.root, className);

  const modalDOMNode = useDOMNode(window, Boolean(open));
  const handleEscapeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.keyCode === 27) {
        if (onEscapeKeyDown) {
          onEscapeKeyDown(e);
        }
        if (onClose) {
          onClose(e, "escapeKeyDown");
        }
      }
    },
    [onEscapeKeyDown, onClose]
  );
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (onBackdropClick) {
        onBackdropClick(e);
      }
      if (onClose) {
        onClose(e, "backdropClick");
      }
    },
    [onBackdropClick, onClose]
  );

  if (open && modalDOMNode) {
    return ReactDOM.createPortal(
      <div role="dialog" className={rootClassName} {...rest}>
        <NoScroll active={open} />
        <Backdrop
          active={open}
          data-testid="backdrop"
          onClick={handleBackdropClick}
        />
        <div
          role="presentation"
          className={cn(
            styles.baseScroll,
            disableScroll ? styles.noScroll : styles.scroll
          )}
          onKeyDown={handleEscapeKeyDown}
        >
          <div className={styles.alignContainer1}>
            <div className={styles.alignContainer2}>
              <div className={styles.wrapper}>
                <TrapFocus>{children}</TrapFocus>
              </div>
            </div>
          </div>
        </div>
      </div>,
      modalDOMNode
    );
  }
  return null;
};

const enhanced = withStyles(styles)(Modal);
export default enhanced;
