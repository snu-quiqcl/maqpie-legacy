import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
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
  const [experimentTab, setExperimentTab] = useState<string>('args');

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
      <Box>
        <TabContext value={experimentTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              centered
              onChange={(_, value) => setExperimentTab(value)}
            >
              <Tab label='Arguments' value='args' />
              <Tab label='Scheduling Options' value='schedOpts' />
            </TabList>
          </Box>
          <TabPanel value='args'>
            Arguments
          </TabPanel>
          <TabPanel value='schedOpts'>
            Scheduling Options
          </TabPanel>
        </TabContext>
      </Box>
    </Card>
  );
}
