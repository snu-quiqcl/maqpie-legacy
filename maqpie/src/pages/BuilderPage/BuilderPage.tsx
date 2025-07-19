import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

import Explorer from './components/Explorer/Explorer';

export default function BuilderPage() {
  const [openExplorer, setOpenExplorer] = useState(false);

  return (
    <Stack>
      <Stack direction='row' justifyContent='flex-end' spacing={2}>
        <Button
          variant='contained'
          onClick={() => setOpenExplorer(true)}
        >
          Explorer
        </Button>
      </Stack>
      <Dialog
        fullWidth
        maxWidth='md'
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
