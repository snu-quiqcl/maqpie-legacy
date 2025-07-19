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
import { formatDict } from '../../../../utils/utils';

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

  const validateAndScaleNumberInScan = (value: string, def: number) => {
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

  const RenderNoScan = () => {
    const noScan = arg.value.NoScan;
    const [rawValue, setRawValue] = useState<string>((noScan.value / arg.scale).toString());
    const [rawRepetitions, setRawRepetitions] = useState<string>(noScan.repetitions.toString());

    const handleNoScanValueBlur = () => {
      const value = validateAndScaleNumberInScan(rawValue, noScan.value);
      setRawValue((value / arg.scale).toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, NoScan: { ...noScan, value } } },
      }));
    };

    const handleNoScanRepetitionsBlur = () => {
      const repetitions = Math.floor(validateAndScaleNumber(
        rawRepetitions, 1, noScan.repetitions, 0, null
      ));
      setRawRepetitions(repetitions.toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, NoScan: { ...noScan, repetitions } } },
      }));
    };

    return (
      <Tooltip title={formatDict(arg.default.NoScan)}>
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
      </Tooltip>
    );
  };

  const RenderRangeScan = () => {
    const rangeScan = arg.value.RangeScan;
    const [rawStart, setRawStart] = useState<string>((rangeScan.start / arg.scale).toString());
    const [rawStop, setRawStop] = useState<string>((rangeScan.stop / arg.scale).toString());
    const [rawNpoints, setRawNpoints] = useState<string>(rangeScan.npoints.toString());
    const [rawSeed, setRawSeed] = useState<string>(rangeScan.seed?.toString() ?? '');

    const handleRangeScanStartBlur = () => {
      const start = validateAndScaleNumberInScan(rawStart, rangeScan.start);
      setRawStart((start / arg.scale).toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, RangeScan: { ...rangeScan, start } } },
      }));
    };

    const handleRangeScanStopBlur = () => {
      const stop = validateAndScaleNumberInScan(rawStop, rangeScan.stop);
      setRawStop((stop / arg.scale).toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, RangeScan: { ...rangeScan, stop } } },
      }));
    };

    const handleRangeScanNpointsBlur = () => {
      const npoints = Math.floor(validateAndScaleNumber(rawNpoints, 1, rangeScan.npoints, 0, null));
      setRawNpoints(npoints.toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, RangeScan: { ...rangeScan, npoints } } },
      }));
    };

    const handleRangeScanRandomizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, RangeScan: {
          ...rangeScan, randomize: event.target.checked,
        } } },
      }));
    };

    const handleRangeScanSeedBlur = () => {
      const seed = Math.floor(validateAndScaleNumber(rawSeed, 1, rangeScan.seed ?? 0, 0, null));
      setRawSeed(seed.toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, RangeScan: { ...rangeScan, seed } } },
      }));
    };

    return (
      <Tooltip title={formatDict(arg.default.RangeScan)}>
        <Stack spacing={2}>
          <Stack direction='row' spacing={2}>
            <TextField
              label='start'
              variant='outlined'
              fullWidth
              value={rawStart}
              onChange={(event) => setRawStart(event.target.value)}
              onBlur={() => handleRangeScanStartBlur()}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position='end'>{arg.unit}</InputAdornment>,
                },
              }}
            />
            <TextField
              label='stop'
              variant='outlined'
              fullWidth
              value={rawStop}
              onChange={(event) => setRawStop(event.target.value)}
              onBlur={() => handleRangeScanStopBlur()}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position='end'>{arg.unit}</InputAdornment>,
                },
              }}
            />
            <TextField
              label='npoints'
              variant='outlined'
              fullWidth
              value={rawNpoints}
              onChange={(event) => setRawNpoints(event.target.value)}
              onBlur={() => handleRangeScanNpointsBlur()}
            />
          </Stack>
          <Stack direction='row' spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rangeScan.randomize}
                  onChange={handleRangeScanRandomizeChange}
                />
              }
              label={'Randomize'}
            />
            <TextField
              label='seed'
              variant='outlined'
              fullWidth
              disabled={!rangeScan.randomize}
              value={rawSeed}
              onChange={(event) => setRawSeed(event.target.value)}
              onBlur={() => handleRangeScanSeedBlur()}
            />
          </Stack>
        </Stack>
      </Tooltip>
    );
  };

  const RenderCenterScan = () => {
    const centerScan = arg.value.CenterScan;
    const [rawCenter, setRawCenter] = useState<string>((centerScan.center / arg.scale).toString());
    const [rawSpan, setRawSpan] = useState<string>((centerScan.span / arg.scale).toString());
    const [rawStep, setRawStep] = useState<string>((centerScan.step / arg.scale).toString());
    const [rawSeed, setRawSeed] = useState<string>(centerScan.seed?.toString() ?? '');

    const handleCenterScanCenterBlur = () => {
      const center = validateAndScaleNumberInScan(rawCenter, centerScan.center);
      setRawCenter((center / arg.scale).toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, CenterScan: { ...centerScan, center } } },
      }));
    };

    const handleCenterScanSpanBlur = () => {
      const span = validateAndScaleNumber(rawSpan, arg.scale, centerScan.span, 0, null);
      setRawSpan((span / arg.scale).toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, CenterScan: { ...centerScan, span } } },
      }));
    };

    const handleCenterScanStepBlur = () => {
      const step = validateAndScaleNumber(rawStep, arg.scale, centerScan.step, 0, null);
      setRawStep(step.toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, CenterScan: { ...centerScan, step } } },
      }));
    };

    const handleCenterScanRandomizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, CenterScan: {
          ...centerScan, randomize: event.target.checked,
        } } },
      }));
    };

    const handleCenterScanSeedBlur = () => {
      const seed = Math.floor(validateAndScaleNumber(rawSeed, 1, centerScan.seed ?? 0, 0, null));
      setRawSeed(seed.toString());

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, CenterScan: { ...centerScan, seed } } },
      }));
    };

    return (
      <Tooltip title={formatDict(arg.default.CenterScan)}>
        <Stack spacing={2}>
          <Stack direction='row' spacing={2}>
            <TextField
              label='center'
              variant='outlined'
              fullWidth
              value={rawCenter}
              onChange={(event) => setRawCenter(event.target.value)}
              onBlur={() => handleCenterScanCenterBlur()}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position='end'>{arg.unit}</InputAdornment>,
                },
              }}
            />
            <TextField
              label='span'
              variant='outlined'
              fullWidth
              value={rawSpan}
              onChange={(event) => setRawSpan(event.target.value)}
              onBlur={() => handleCenterScanSpanBlur()}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position='end'>{arg.unit}</InputAdornment>,
                },
              }}
            />
            <TextField
              label='step'
              variant='outlined'
              fullWidth
              value={rawStep}
              onChange={(event) => setRawStep(event.target.value)}
              onBlur={() => handleCenterScanStepBlur()}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position='end'>{arg.unit}</InputAdornment>,
                },
              }}
            />
          </Stack>
          <Stack direction='row' spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={centerScan.randomize}
                  onChange={handleCenterScanRandomizeChange}
                />
              }
              label={'Randomize'}
            />
            <TextField
              label='seed'
              variant='outlined'
              fullWidth
              disabled={!centerScan.randomize}
              value={rawSeed}
              onChange={(event) => setRawSeed(event.target.value)}
              onBlur={() => handleCenterScanSeedBlur()}
            />
          </Stack>
        </Stack>
      </Tooltip>
    );
  };

  const RenderExplicitScan = () => {
    const explicitScan = arg.value.ExplicitScan;
    const [rawSequence, setRawSequence] = useState<string>(
      explicitScan.sequence.map((value) => (value / arg.scale).toString()).join(', ')
    );

    const handleSequenceBlur = () => {
      const sequence = rawSequence.split(', ').map(
        (value) => validateAndScaleNumberInScan(value, NaN)
      ).filter((value) => !isNaN(value));
      setRawSequence(sequence.map((value) => (value / arg.scale).toString()).join(', '));

      dispatch(experimentActions.updateArg({
        experimentId,
        argId: arg.id,
        arg: { ...arg, value: { ...arg.value, ExplicitScan: { ...explicitScan, sequence } } },
      }));
    };

    return (
      <Tooltip title={formatDict(arg.default.ExplicitScan)}>
        <TextField
          label='sequence'
          variant='outlined'
          fullWidth
          value={rawSequence}
          onChange={(event) => setRawSequence(event.target.value)}
          onBlur={() => handleSequenceBlur()}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position='end'>{arg.unit}</InputAdornment>,
            },
          }}
        />
      </Tooltip>
    );
  };

  return (
    <Stack spacing={2}>
      <Tooltip
        title={`
          ${arg.tooltip ? arg.tooltip + '\n' : ''}
          (Default selected: ${arg.default.selected})
        `}
      >
        <Typography variant='subtitle1'>{arg.name}</Typography>
      </Tooltip>
      <Box>
        <TabContext value={arg.value.selected}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              centered
              onChange={(_, value) => handleTabChange(value)}
            >
              <Tab label='No' value='NoScan' />
              <Tab label='Range' value='RangeScan' />
              <Tab label='Center' value='CenterScan' />
              <Tab label='Explicit' value='ExplicitScan' />
            </TabList>
          </Box>
          <TabPanel value='NoScan'>
            {RenderNoScan()}
          </TabPanel>
          <TabPanel value='RangeScan'>
            {RenderRangeScan()}
          </TabPanel>
          <TabPanel value='CenterScan'>
            {RenderCenterScan()}
          </TabPanel>
          <TabPanel value='ExplicitScan'>
            {RenderExplicitScan()}
          </TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}
