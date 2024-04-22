import { Box, Button } from "@mui/material";
import {
  Menu as MenuIcon,
  Upload as UploadIcon,
  Camera as CameraIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import Webcam from "react-webcam";
import React, {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  FC,
} from "react";

interface BillingCameraProps {
  onSubmit: (imgSrc: string) => Promise<void>;
  imgSrc: string | null;
  setImgSrc: (imgSrc: string | null) => void;
}

const BillingCamera: FC<BillingCameraProps> = ({
  onSubmit,
  imgSrc,
  setImgSrc,
}) => {
  const webcamRef = useRef<null | React.ElementRef<typeof Webcam>>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot?.() ?? null;
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const onUpload = useCallback(
    (event: any) => {
      const input = event.target;
      const files = input.files;
      if (files.length) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          console.log("image", files[0], reader.result);
          const result = (reader.result as string) ?? "base64,";
          // setImgSrc(result.slice(result.indexOf("base64,") + 7));
          setImgSrc(result);
        });
        reader.readAsDataURL(files[0]);
      }
    },
    [setImgSrc]
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          backgroundColor: "grey.800",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // flex: 1,
        }}
      >
        {!imgSrc ? (
          <Webcam
            ref={webcamRef}
            width={416}
            height={416}
            style={{ marginBottom: 0 }}
            videoConstraints={{
              width: 416,
              height: 416,
              facingMode: "user",
            }}
            screenshotFormat="image/jpeg"
          />
        ) : (
          <img src={imgSrc} style={{ width: 416, height: 416 }} alt="billing" />
        )}
      </Box>
      {!imgSrc ? (
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button
            variant="contained"
            size="large"
            color="secondary"
            endIcon={<CameraIcon />}
            sx={{ flex: 1, borderRadius: 0 }}
            onClick={capture}
          >
            Capture
          </Button>
          <Button
            variant="contained"
            size="large"
            endIcon={<UploadIcon />}
            sx={{ flex: 1, borderRadius: 0 }}
            component="label"
          >
            Upload
            <input hidden onChange={onUpload} accept="image/jpg" type="file" />
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Button
            variant="contained"
            size="large"
            color="success"
            endIcon={<SendIcon />}
            sx={{ flex: 1, borderRadius: 0 }}
            onClick={() => onSubmit(imgSrc)}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            size="large"
            color="error"
            endIcon={<CancelIcon />}
            sx={{ flex: 1, borderRadius: 0 }}
            onClick={() => setImgSrc(null)}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BillingCamera;
