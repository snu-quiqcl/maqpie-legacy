import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';

import type { AppDispatch } from '../../../../store';
import { experimentActions, type Arg, type BooleanArg } from '../../../../store/slices/experiment/experiment';

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
