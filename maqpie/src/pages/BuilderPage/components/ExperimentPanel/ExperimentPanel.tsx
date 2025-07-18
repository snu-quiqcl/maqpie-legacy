import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import type { AppDispatch } from '../../../../store';
import { experimentActions, type Experiment } from '../../../../store/slices/experiment/experiment';
import {
  BooleanArgInput,
  EnumerationArgInput,
  NumberArgInput,
  ScanArgInput,
  StringArgInput,
} from './ArgInput';
import { PipelineInput, PriorityInput, TimedInput } from './SchedOptInput';

type ExperimentPanelProps = {
  experiment: Experiment;
};

export default function ExperimentPanel({ experiment }: ExperimentPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<string>('args');

  const handleTagChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) => {
    dispatch(experimentActions.updateExperiment({
      experimentId: id,
      experiment: { ...experiment, tag: event.target.value },
    }));
  };

  return (
    <Card id={experiment.id} variant='outlined'>
      <CardContent>
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
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                centered
                onChange={(_, value) => setActiveTab(value)}
              >
                <Tab label='Arguments' value='args' />
                <Tab label='Scheduling Options' value='schedOpts' />
              </TabList>
            </Box>
            <TabPanel value='args'>
              <Stack spacing={2}>
                {experiment.args.map((arg) => {
                  if (arg.kind === 'BooleanArg') {
                    return (
                      <BooleanArgInput
                        key={arg.id}
                        experimentId={experiment.id}
                        arg={arg}
                      />
                    );
                  } else if (arg.kind === 'EnumerationArg') {
                    return (
                      <EnumerationArgInput
                        key={arg.id}
                        experimentId={experiment.id}
                        arg={arg}
                      />
                    );
                  } else if (arg.kind === 'NumberArg') {
                    return (
                      <NumberArgInput
                        key={arg.id}
                        experimentId={experiment.id}
                        arg={arg}
                      />
                    );
                  } else if (arg.kind === 'StringArg') {
                    return (
                      <StringArgInput
                        key={arg.id}
                        experimentId={experiment.id}
                        arg={arg}
                      />
                    );
                  } else if (arg.kind === 'ScanArg') {
                    return (
                      <ScanArgInput
                        key={arg.id}
                        experimentId={experiment.id}
                        arg={arg}
                      />
                    );
                  }
                  throw new Error(`Unknown argument kind: ${arg.kind}`);
                })}
              </Stack>
            </TabPanel>
            <TabPanel value='schedOpts'>
              <Stack spacing={2}>
                <PipelineInput experiment={experiment} />
                <PriorityInput experiment={experiment} />
                <TimedInput experiment={experiment} />
              </Stack>
            </TabPanel>
          </TabContext>
        </Box>
      </CardContent>
    </Card>
  );
}
