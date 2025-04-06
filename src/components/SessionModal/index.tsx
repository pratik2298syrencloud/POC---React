import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { EmailAddresses, SessionTime } from "../../pages/Calender";


interface SessionModelProps {
  selectedDate: string | null;
  sessionTime: SessionTime;
  setSessionTime: React.Dispatch<React.SetStateAction<SessionTime>>;
  emailAddresses: EmailAddresses;
  setEmailAddresses: React.Dispatch<React.SetStateAction<EmailAddresses>>;
}

const SessionModal = ({
  selectedDate,
  sessionTime,
  setSessionTime,
  emailAddresses,
  setEmailAddresses,
}: SessionModelProps) => {
  return (
    <Box height="300px" width="100%">
      <Stack direction="column" spacing={3} mt={2}>
        <Typography sx={{ fontSize: "18px" }}>Date: {selectedDate}</Typography>
        <Stack direction="row" spacing={2} alignItems="center" flex={1}>
          <Typography variant="caption" sx={{ fontSize: "18px" }}>
            Time:{" "}
          </Typography>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="hour-select-label">Hour</InputLabel>
            <Select
              labelId="hour-select-label"
              id="hour-select"
              value={sessionTime.hour}
              onChange={(e) =>
                setSessionTime((prev) => ({ ...prev, hour: e.target.value }))
              }
              label="Hour"
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="minute-select-label">Minute</InputLabel>
            <Select
              labelId="minute-select-label"
              id="minute-select"
              value={sessionTime.minute}
              onChange={(e) =>
                setSessionTime((prev) => ({
                  ...prev,
                  minute: e.target.value,
                }))
              }
              label="Minute"
            >
              {[0, 15, 30, 45].map((m) => (
                <MenuItem key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="am-pm-select-label">AM/PM</InputLabel>
            <Select
              labelId="am-pm-select-label"
              id="am-pm-select"
              value={sessionTime.period}
              onChange={(e) =>
                setSessionTime((prev) => ({ ...prev, period: e.target.value }))
              }
              label="AM/PM"
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" gap={2}>
          <TextField
            id="claimants"
            label="Claimant Email Id"
            variant="outlined"
            fullWidth
            size="small"
            value={emailAddresses.claimantEmail}
            onChange={(e) =>
              setEmailAddresses((prev) => ({
                ...prev,
                claimantEmail: e.target.value,
              }))
            }
          />
          <TextField
            id="respondents"
            label="Respondent Email Id"
            variant="outlined"
            fullWidth
            size="small"
            value={emailAddresses.respondentEmail}
            onChange={(e) =>
              setEmailAddresses((prev) => ({
                ...prev,
                respondentEmail: e.target.value,
              }))
            }
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SessionModal;



