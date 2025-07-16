import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import type { AppDispatch } from '../../../../store';
import {
  experimentActions,
  type Arg,
  type BooleanArg,
  type EnumerationArg,
  type StringArg,
} from '../../../../store/slices/experiment/experiment';

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
      <Tooltip title={[arg.tooltip, `(Default: ${arg.default})`].filter(Boolean).join('\n')}>
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
      <Tooltip title={[arg.tooltip, `(Default: ${arg.default})`].filter(Boolean).join('\n')}>
        <FormControl fullWidth>
          <InputLabel id={`${arg.id}-select-label`}>{arg.name}</InputLabel>
          <Select
            labelId={`${arg.id}-select-label`}
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
      <Tooltip title={[arg.tooltip, `(Default: ${arg.default})`].filter(Boolean).join('\n')}>
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
