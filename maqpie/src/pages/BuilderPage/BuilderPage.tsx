import { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { selectExperiment } from '../../store/slices/experiment/experiment';
import ExperimentPanel from './components/ExperimentPanel/ExperimentPanel';
import Explorer from './components/Explorer/Explorer';

export default function BuilderPage() {
  const experimentState = useSelector(selectExperiment);
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
      <Grid container spacing={2}>
        {experimentState.experiments.map((experiment) => (
          <Grid size={4}>
            <ExperimentPanel experiment={experiment} />
          </Grid>
        ))}
      </Grid>
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
