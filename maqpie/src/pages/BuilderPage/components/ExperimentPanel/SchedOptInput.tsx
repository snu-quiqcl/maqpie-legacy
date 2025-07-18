import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import type { AppDispatch } from '../../../../store';
import { experimentActions, type Experiment } from '../../../../store/slices/experiment/experiment';

type SchedOptInputProps = {
  experiment: Experiment;
};

export function PipelineInput({ experiment }: SchedOptInputProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(experimentActions.updateExperiment({
      experimentId: experiment.id,
      experiment: { ...experiment, schedOpts: {
        ...experiment.schedOpts, pipeline: event.target.value,
      } },
    }));
  };

  return (
    <Box>
      <TextField
        label='Pipeline'
        variant='outlined'
        fullWidth
        value={experiment.schedOpts.pipeline}
        onChange={handleChange}
      />
    </Box>
  );
}

export function PriorityInput({ experiment }: SchedOptInputProps) {
  const [rawPriority, setRawPriority] = useState<string>(experiment.schedOpts.priority.toString());

  const dispatch = useDispatch<AppDispatch>();

  const handlePriorityBlur = () => {
    let priority = parseInt(rawPriority.replace(/[^0-9]/g, ''));
    if (isNaN(priority)) {
      priority = 0;
    }

    dispatch(experimentActions.updateExperiment({
      experimentId: experiment.id,
      experiment: { ...experiment, schedOpts: {
        ...experiment.schedOpts, priority,
      } },
    }));
  };

  return (
    <Box>
      <TextField
        label='Priority'
        variant='outlined'
        fullWidth
        value={rawPriority}
        onChange={(event) => setRawPriority(event.target.value)}
        onBlur={() => handlePriorityBlur()}
      />
    </Box>
  );
}
