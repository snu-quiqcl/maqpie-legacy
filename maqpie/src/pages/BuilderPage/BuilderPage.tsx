import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";

import Explorer from "./components/Explorer/explorer";

export default function BuilderPage() {
  const [openExplorer, setOpenExplorer] = useState(false);

  return (
    <Stack>
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button
          variant="contained"
          onClick={() => setOpenExplorer(true)}
        >
          Explorer
        </Button>
      </Stack>
      <Dialog
        onClose={() => setOpenExplorer(false)}
        open={openExplorer}
      >
        <DialogTitle>
          Explorer
        </DialogTitle>
        <DialogContent>
          <Explorer />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
