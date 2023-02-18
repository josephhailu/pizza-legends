import {FC, PropsWithChildren} from "react";
import {StyledControl} from "./styles";
import {FileUploadProps} from "./types";

export const FileUpload: FC<PropsWithChildren<FileUploadProps>> = ({
  appState,
  setAppState,
}) => {
  const {
    mapImage,
    imageSettings: {cssScaleFactor: zoom},
  } = appState;

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ?? [];
    const selectedFile = selectedFiles[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = (_event) => {
      mapImage.src = reader.result as string;
    };
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppState((prevState) => {
      return {
        ...prevState,
        imageSettings: {
          ...prevState.imageSettings,
          cssScaleFactor: e.target.valueAsNumber,
        },
      };
    });
  };
  const showImageSettings = Boolean(mapImage.height && mapImage.width);
  return (
    <div>
      <h3>Image Properties:</h3>
      <StyledControl>
        <div>
          <label htmlFor="upload">Upload Image</label>
          <input
            type="file"
            name="upload"
            id="upload"
            accept="image/*"
            onChange={handleFileOnChange}
          />
        </div>
        {showImageSettings && (
          <>
            <div>
              <label htmlFor="zoom">Zoom</label>
              <input
                type="range"
                name="zoom"
                id="zoom"
                max="20"
                min="1"
                value={zoom}
                step="1"
                onChange={handleZoomChange}
              />
            </div>
            <div>
              <p id="image-properties">{`Width :  ${mapImage.width}px Height: ${mapImage.height}px`}</p>
            </div>
          </>
        )}
      </StyledControl>
    </div>
  );
};

export default FileUpload;
