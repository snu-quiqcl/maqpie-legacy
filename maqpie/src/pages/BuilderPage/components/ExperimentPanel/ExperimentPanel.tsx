import { useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import type { AppDispatch } from '../../../../store';
import { experimentActions, type Experiment } from '../../../../store/slices/experiment/experiment';

type ExperimentPanelProps = {
  experiment: Experiment;
};

export default function ExperimentPanel({ experiment }: ExperimentPanelProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleTagChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) => {
    dispatch(experimentActions.updateExperiment({
      id,
      experiment: { ...experiment, tag: event.target.value },
    }));
  };

  return (
    <Card id={experiment.id} variant='outlined'>
      <Tooltip title={experiment.path}>
        <Typography variant='h6'>{experiment.cls}</Typography>
      </Tooltip>
      <TextField
        label='Tag'
        variant='standard'
        value={experiment.tag}
        onChange={(event) => handleTagChange(event, experiment.id)}
      />
      <Typography variant='subtitle1'>{experiment.name}</Typography>
    </Card>
  );
}
