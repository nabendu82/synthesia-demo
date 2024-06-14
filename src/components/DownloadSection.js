import { DownloadLink, DownloadSection, ResetButton } from "./SynthesiaStyled";

const DownloadComponent = ({ downloadUrl, onReset }) => {
    return (
        <DownloadSection>
            <h3>Download Your Video</h3>
            <DownloadLink href={downloadUrl} download>Download Video</DownloadLink>
            <ResetButton onClick={onReset}>Reset Form</ResetButton>
        </DownloadSection>
    );
};

export default DownloadComponent;
