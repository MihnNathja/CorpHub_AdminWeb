// src/hooks/useAttachmentUpload.js

import { useDispatch, useSelector } from "react-redux";
import { removeAttachment, uploadAttachment } from "../store/attachmentSlice";

export const useAttachmentUpload = () => {
  const dispatch = useDispatch();
  const { items, uploading } = useSelector((state) => state.attachments);

  const upload = (file, uploadedById) => {
    dispatch(uploadAttachment({ file, uploadedById }));
  };

  const remove = (fileKey) => {
    dispatch(removeAttachment(fileKey));
  };

  return {
    attachments: items,
    uploading,
    upload,
    remove,
  };
};
