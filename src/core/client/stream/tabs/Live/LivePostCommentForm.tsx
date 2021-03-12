import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import React, {
  EventHandler,
  FocusEvent,
  FunctionComponent,
  MouseEvent,
  Ref,
} from "react";

import { OnSubmit } from "coral-framework/lib/form";
import { AriaInfo } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import CommentForm from "../Comments/Stream/CommentForm";
import { OnChangeHandler } from "../Comments/Stream/CommentForm/CommentForm";
import PostCommentSubmitStatusContainer from "../Comments/Stream/PostCommentForm/PostCommentSubmitStatusContainer";

export interface LiveCommentFormProps {
  className?: string;
  onSubmit: OnSubmit<any>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onChange?: OnChangeHandler;
  initialValues?: any;
  rteRef?: Ref<CoralRTE>;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  siteID: string;
  disabledMessage?: React.ReactNode;
  rteConfig: PropTypesOf<typeof CommentForm>["rteConfig"];
  mediaConfig: PropTypesOf<typeof CommentForm>["mediaConfig"];
  submitStatus: PropTypesOf<PostCommentSubmitStatusContainer>["status"];
  showToolbar?: boolean;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
}

const LiveCommentForm: FunctionComponent<LiveCommentFormProps> = (props) => {
  const inputID = `comments-LiveCommentForm-rte`;
  // TODO @cvle.
  const classNameRoot = "createComment";

  // TODO @nick-funk, hook up media config when we have designs
  const mediaConfig = {
    external: {
      enabled: false,
    },
    youtube: {
      enabled: false,
    },
    twitter: {
      enabled: false,
    },
    giphy: {
      enabled: false,
      key: "",
      maxRating: "",
    },
  };

  return (
    <div>
      <CommentForm
        rteRef={props.rteRef}
        siteID={props.siteID}
        onSubmit={props.onSubmit}
        onChange={props.onChange}
        initialValues={props.initialValues}
        min={props.min}
        max={props.max}
        disabled={props.disabled}
        classNameRoot={classNameRoot}
        disabledMessage={props.disabledMessage}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onCancel={props.onCancel}
        mediaConfig={mediaConfig}
        placeHolderId="comments-liveCommentForm-rte"
        placeholder="Write a message..."
        bodyInputID={inputID}
        bodyLabel={
          <>
            <Localized id="comments-liveCommentForm-rteLabel">
              <AriaInfo component="label" htmlFor={inputID}>
                Write a message...
              </AriaInfo>
            </Localized>
          </>
        }
        rteConfig={props.rteConfig}
        mode="chat"
        submitStatus={
          <PostCommentSubmitStatusContainer status={props.submitStatus} />
        }
        autoHideToolbar
        focusAfterSubmit
      />
    </div>
  );
};

export default LiveCommentForm;