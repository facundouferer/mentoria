import { Button } from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";

export default function ReportButton({ props }) {
  const { handleReport, post } = props;

  return (
    <Button
      startIcon={<FlagIcon />}
      onClick={() => handleReport(post)}
      color="warning"
      variant="outlined"
      hoverColor="warning"
    >
      Reportar
    </Button>
  );
}
