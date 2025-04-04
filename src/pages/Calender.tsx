import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  Stack,
  Drawer,
} from "@mui/material";
import SessionModal from "./SessionModal";
import { v4 as uuidv4 } from "uuid";
import { SessionCard } from "../components/SessionDetailsCard";
import CustomSnackbar, { CustomSnackbarProps } from "../components/Snackbar";

// Define types for session data
export interface Session {
  date: string;
  caseNumber: string;
}

export interface SessionTime {
  hour: string;
  minute: string;
  period: string;
}

export interface EmailAddresses {
  claimantEmail: string;
  respondentEmail: string;
}

export interface ScheduleSession {
  caseNumber: string;
  selectedDate: string | null;
  sessionTiming: SessionTime;
  emailAddresses: EmailAddresses;
}
const viewModeConfig: { label: string; value: string }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

const Calendar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  const [sessionTime, setSessionTime] = useState<SessionTime>({
    hour: "",
    minute: "",
    period: "",
  });
  const [emailAddresses, setEmailAddresses] = useState<{
    claimantEmail: string;
    respondentEmail: string;
  }>({
    claimantEmail: "",
    respondentEmail: "",
  });

  const [scheduleSessions, setScheduleSessions] = useState<ScheduleSession[]>(
    []
  );
  const [activeSession, setActiveSession] = useState<ScheduleSession | null>(
    null
  );

  const [showScheduledSessionList, setShowScheduledSessionList] =
    useState<boolean>(false);

  const [snackbarData, setSnackbarData] = useState<CustomSnackbarProps>({
    open: false,
    message: "",
    status: "info",
    autoHideDuration: 3000,
    onClose: () => setSnackbarData((prev) => ({ ...prev, open: false })),
  });

  // const handleDateClick = (dateWithYear: string) => {
  //   setSelectedDate(dateWithYear); // Store full date (including year)
  //   setOpen(true);
  // };

  const handleDateClick = (dateWithYear: string) => {
    setSelectedDate(dateWithYear);

    // Try to find a session for this date
    const existing = scheduleSessions.find(
      (s) => s.selectedDate === dateWithYear
    );

    if (existing) {
      setSessionTime(existing.sessionTiming);
      setEmailAddresses(existing.emailAddresses);
      setActiveSession(existing);
    } else {
      // If no session scheduled, reset form state
      resetFormState();
      setActiveSession(null);
      setSelectedDate(dateWithYear);
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: "day" | "week" | "month" | null
  ) => {
    if (newMode) setViewMode(newMode);
  };

  const renderCalendar = () => {
    let days: { displayDate: string; fullDate: string; dayName: string }[] = [];
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    if (viewMode === "day") {
      const dayName = today.toLocaleString("default", { weekday: "long" });
      days = [
        {
          displayDate: `${month} ${today.getDate()}`,
          fullDate: `${month} ${today.getDate()}, ${year}`,
          dayName,
        },
      ];
    } else if (viewMode === "week") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return {
          displayDate: `${d.toLocaleString("default", { month: "long" })} ${d.getDate()}`,
          fullDate: `${d.toLocaleString("default", { month: "long" })} ${d.getDate()}, ${d.getFullYear()}`,
          dayName: d.toLocaleString("default", { weekday: "long" }),
        };
      });
    } else if (viewMode === "month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();

      days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(firstDay);
        d.setDate(firstDay.getDate() + i);
        return {
          displayDate: `${d.toLocaleString("default", { month: "long" })} ${d.getDate()}`,
          fullDate: `${d.toLocaleString("default", { month: "long" })} ${d.getDate()}, ${d.getFullYear()}`,
          dayName: d.toLocaleString("default", { weekday: "long" }),
        };
      });
    }

    return (
      <Card sx={{ padding: "30px", bgcolor: "#FAF9F6" }}>
        <Grid container spacing={1} justifyContent="center">
          {days.map((day, i) => {
            const hasSession = scheduleSessions.some(
              (s) => s.selectedDate === day.fullDate
            );

            return (
              <Grid item key={i} xs={viewMode === "day" ? 12 : 1.5}>
                <Box
                  p={2}
                  minWidth={100}
                  minHeight={80}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  border={2}
                  borderRadius={2}
                  textAlign="center"
                  onClick={() => handleDateClick(day.fullDate)}
                  sx={{
                    cursor: "pointer",
                    borderColor: hasSession ? "red" : "grey.400",
                    backgroundColor: hasSession ? "#ffe6e6" : "transparent",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <Typography>{day.displayDate}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {day.dayName}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Card>
    );
  };

  const onSaveScheduleSession = () => {
    if (!selectedDate) return;

    const existingIndex = scheduleSessions.findIndex(
      (s) => s.selectedDate === selectedDate
    );

    const updatedSession: ScheduleSession = {
      caseNumber: activeSession?.caseNumber || uuidv4(),
      selectedDate,
      sessionTiming: sessionTime,
      emailAddresses,
    };

    if (existingIndex !== -1) {
      // If session exists for selectedDate, update it
      const updatedSessions = [...scheduleSessions];
      updatedSessions[existingIndex] = updatedSession;
      setScheduleSessions(updatedSessions);
    } else {
      // If it's a new session, add it
      setScheduleSessions((prev) => [...prev, updatedSession]);
    }

    // Reset form
    resetFormState();
    setActiveSession(null);
    setOpen(false);
    setSnackbarData((prev) => ({
      ...prev,
      open: true,
      message: "Session Scheduled",
      status: "success",
    }));
  };

  const resetFormState = () => {
    setSessionTime({ hour: "", minute: "", period: "" });
    setEmailAddresses({ claimantEmail: "", respondentEmail: "" });
    setSelectedDate(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Arbitration Session Scheduler
      </Typography>
      <Stack
        direction="row"
        gap={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={onViewChange}
          sx={{ marginBottom: 2 }}
        >
          {viewModeConfig.map((viewMode) => (
            <ToggleButton key={viewMode.value} value={viewMode.value}>
              {viewMode.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "none" }}
          onClick={() => setShowScheduledSessionList(true)}
        >
          {" "}
          View All Scheduled Session
        </Button>
      </Stack>

      {renderCalendar()}
      {sessions.map((session, index) => (
        <Typography
          key={index}
        >{`${session.date}: ${session.caseNumber}`}</Typography>
      ))}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          {activeSession ? "Edit Scheduled Session" : "Schedule a Session"}
        </DialogTitle>

        <DialogContent>
          <SessionModal
            selectedDate={selectedDate}
            sessionTime={sessionTime}
            setSessionTime={setSessionTime}
            emailAddresses={emailAddresses}
            setEmailAddresses={setEmailAddresses}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSaveScheduleSession}>Save</Button>
        </DialogActions>
      </Dialog>
      <Drawer
        open={showScheduledSessionList}
        onClose={() => setShowScheduledSessionList(false)}
        anchor="right"
      >
        <Box
          sx={{ width: 450 }}
          role="presentation"
          onClick={() => setShowScheduledSessionList(false)}
          padding={3}
        >
          {scheduleSessions.map((session: ScheduleSession) => (
            <SessionCard
              key={session.caseNumber}
              session={session}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          ))}
        </Box>
      </Drawer>
      <CustomSnackbar
        open={snackbarData.open}
        message={snackbarData.message}
        status={snackbarData.status}
        onClose={snackbarData.onClose}
      />
    </Box>
  );
};

export default Calendar;
