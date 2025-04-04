import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Box,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ScheduleSession } from "../../pages/Calender";

interface SessionCardProps {
  session: ScheduleSession;
  onEdit: () => void;
  onDelete: () => void;
}

export const SessionCard = ({
  session,
  onEdit,
  onDelete,
}: SessionCardProps) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          {/* Left: Session Info */}
          <Box>
            <Tooltip title={session.caseNumber}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                noWrap
                sx={{
                  maxWidth: 300, // adjust width as needed
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Case Number: {session.caseNumber}
              </Typography>
            </Tooltip>

            <Typography variant="body2">
              Date: {session.selectedDate}
            </Typography>
            <Typography variant="body2">
              Time: {session.sessionTiming?.hour}:
              {session.sessionTiming?.minute} {session.sessionTiming?.period}
            </Typography>
            <Typography variant="body2">
              Arbitrator: {"JoheDoe@gmail.com" || "—"}
            </Typography>
            <Typography variant="body2">
              Claimant ID: {session.emailAddresses.claimantEmail || "—"}
            </Typography>
            <Typography variant="body2">
              Dependent ID: {session.emailAddresses.respondentEmail || "—"}
            </Typography>
          </Box>

          {/* Right: Icons */}
          <Stack direction="row" spacing={1}>
            <IconButton onClick={onEdit}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
