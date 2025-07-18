import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import type { AppDispatch } from '../../../../store';
import {
  experimentActions,
  type Arg,
  type BooleanArg,
  type EnumerationArg,
  type NumberArg,
  type ScanArg,
  type StringArg,
} from '../../../../store/slices/experiment/experiment';

function validateAndScaleNumber(
  rawValue: string,
  scale: number,
  def: number,
  min: number | null,
  max: number | null,
): number {
  let value = parseFloat(rawValue.replace(/[^0-9.-]/g, '')) * scale;
  if (isNaN(value)) {
    value = def;
  } else if (min !== null && value < min) {
    value = min;
  } else if (max !== null && value > max) {
    value = max;
  }
  
  return value;
}

type ArgInputProps = {
  experimentId: string;
  arg: Arg<any>;
};

export function BooleanArgInput({ experimentId, arg: arg_ }: ArgInputProps) {
  const arg = arg_ as BooleanArg;
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(experimentActions.updateArg({
      experimentId,
      argId: arg.id,
      arg: { ...arg, value: event.target.checked },
    }));
  };

  return (
    <Box>
      <Tooltip title={`${arg.tooltip ? arg.tooltip + '\n' : ''}(Default: ${arg.default})`}>
        <FormControlLabel
          control={
            <Checkbox
              checked={arg.value}
              onChange={handleChange}
            />
          }
          label={arg.name}
        />
      </Tooltip>
    </Box>
  );
}

export function EnumerationArgInput({ experimentId, arg: arg_ }: ArgInputProps) {
  const arg = arg_ as EnumerationArg;
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: SelectChangeEvent<string>) => {
    dispatch(experimentActions.updateArg({
      experimentId,
      argId: arg.id,
      arg: { ...arg, value: event.target.value },
    }));
  };

  return (
    <Box>
      <Tooltip title={`${arg.tooltip ? arg.tooltip + '\n' : ''}(Default: ${arg.default})`}>
        <FormControl fullWidth>
          <InputLabel id={`${arg.id}-select-label`}>{arg.name}</InputLabel>
          <Select
            labelId={`${arg.id}-select-label`}
            label={arg.name}
            value={arg.value}
            onChange={handleChange}
          >
            {arg.choices.map((choice) => (
              <MenuItem key={choice} value={choice}>
                {choice}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
    </Box>
  );
}

export function NumberArgInput({ experimentId, arg: arg_ }: ArgInputProps) {
  const arg = arg_ as NumberArg;
  const dispatch = useDispatch<AppDispatch>();
  const [rawValue, setRawValue] = useState<string>((arg.value / arg.scale).toString());

  const handleValueBlur = () => {
    let value = validateAndScaleNumber(
      rawValue,
      arg.scale,
      arg.default,
      arg.min,
      arg.max,
    );
    if (arg.type === 'int') {
      value = Math.floor(value);
    }
    setRawValue((value / arg.scale).toString());

    dispatch(experimentActions.updateArg({
      experimentId,
      argId: arg.id,
      arg: { ...arg, value },
    }));
  };

  return (
    <Box>
      <Tooltip
        title={`
          ${arg.tooltip ? arg.tooltip + '\n' : ''}
          (Default: ${arg.default / arg.scale}${arg.unit ? ' ' + arg.unit : ''})
        `}
      >
        <TextField
          label={arg.name}
          variant='outlined'
          fullWidth
          value={rawValue}
          onChange={(event) => setRawValue(event.target.value)}
          onBlur={() => handleValueBlur()}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position='end'>{arg.unit}</InputAdornment>,
            },
          }}
        />
      </Tooltip>
    </Box>
  );
}

export function StringArgInput({ experimentId, arg: arg_ }: ArgInputProps) {
  const arg = arg_ as StringArg;
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(experimentActions.updateArg({
      experimentId,
      argId: arg.id,
      arg: { ...arg, value: event.target.value },
    }));
  };

  return (
    <Box>
      <Tooltip title={`${arg.tooltip ? arg.tooltip + '\n' : ''}(Default: ${arg.default})`}>
        <TextField
          label={arg.name}
          variant='outlined'
          fullWidth
          value={arg.value}
          onChange={handleChange}
        />
      </Tooltip>
    </Box>
  );
}

export function ScanArgInput({ experimentId, arg: arg_ }: ArgInputProps) {
  const arg = arg_ as ScanArg;
  const dispatch = useDispatch<AppDispatch>();
  const def: number = (
    arg.global_min !== null ? arg.global_min : (arg.global_max !== null ? arg.global_max : 0)
  );

  const validateAndScaleNumberInScan = (value: string) => {
    return validateAndScaleNumber(
      value,
      arg.scale,
      def,
      arg.global_min,
      arg.global_max,
    );
  };

  const handleTabChange = (value: string) => {
    dispatch(experimentActions.updateArg({
      experimentId,
      argId: arg.id,
      arg: { ...arg, value: { ...arg.value, selected: value } },
    }));
  };

  const renderNoScan = () => {
    const noScan = arg.value.NoScan;
    const [rawValue, setRawValue] = useState<string>((noScan.value / arg.scale).toString());
    const [rawRepetitions, setRawRepetitions] = useState<string>(noScan.repetitions.toString());

    const handleNoScanValueBlur = () => {
      const value = validateAndScaleNumberInScan(rawValue);
      setRawValue((value / arg.scale).toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, NoScan: { ...noScan, value } } },
      }));
    };

    const handleNoScanRepetitionsBlur = () => {
      const repetitions = Math.floor(validateAndScaleNumber(rawRepetitions, 1, 0, 0, null));
      setRawRepetitions(repetitions.toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, NoScan: { ...noScan, repetitions } } },
      }));
    };

    return (
      <Stack direction='row' spacing={2}>
        <TextField
          label='value'
          variant='outlined'
          fullWidth
          value={rawValue}
          onChange={(event) => setRawValue(event.target.value)}
          onBlur={() => handleNoScanValueBlur()}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position='end'>{arg.unit}</InputAdornment>,
            },
          }}
        />
        <TextField
          label='repetitions'
          variant='outlined'
          fullWidth
          value={rawRepetitions}
          onChange={(event) => setRawRepetitions(event.target.value)}
          onBlur={() => handleNoScanRepetitionsBlur()}
        />
      </Stack>
    );
  };

  return (
    <Stack spacing={2}>
      {arg.tooltip ? (
        <Tooltip
          title={`
            ${arg.tooltip ? arg.tooltip + '\n' : ''}
            (Default selected: ${arg.default.selected})
          `}
        >
          <Typography variant='subtitle1'>{arg.name}</Typography>
        </Tooltip>
      ) : (
        <Typography variant='subtitle1'>{arg.name}</Typography>
      )}
      <Box>
        <TabContext value={arg.value.selected}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              centered
              onChange={(_, value) => handleTabChange(value)}
            >
              <Tab label='No' value='noScan' />
              <Tab label='Range' value='rangeScan' />
              <Tab label='Center' value='centerScan' />
              <Tab label='Explicit' value='explicitScan' />
            </TabList>
          </Box>
          <TabPanel value='noScan'>
            {renderNoScan()}
          </TabPanel>
          <TabPanel value='rangeScan'>
            2
          </TabPanel>
          <TabPanel value='centerScan'>
            3
          </TabPanel>
          <TabPanel value='explicitScan'>
            4
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}
