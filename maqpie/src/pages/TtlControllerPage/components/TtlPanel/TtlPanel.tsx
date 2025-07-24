import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import type { AppDispatch } from '../../../../store';
import { setIsOverride, setOverrideValue } from '../../../../store/slices/ttl/ttl';
import type { Ttl } from '../../../../store/slices/ttl/ttl';

type TtlPanelProps = {
  ttl: Ttl;
};

export default function TtlPanel({ ttl }: TtlPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isOverrideEnabled, setIsOverrideEnabled] = useState<boolean>(false);
  const [overrideValueEnabled, setOverrideValueEnabled] = useState<boolean>(false);

  useEffect(() => {
    setIsOverrideEnabled(ttl.isOverride !== null);
  }, [ttl.isOverride]);

  useEffect(() => {
    setOverrideValueEnabled(ttl.overrideValue !== null);
  }, [ttl.overrideValue]);

  const handleIsOverrideChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOverrideEnabled(false);
    dispatch(setIsOverride({ device: ttl.device, isOverride: event.target.checked }));
  };

  const handleOverrideValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOverrideValueEnabled(false);
    dispatch(setOverrideValue({ device: ttl.device, overrideValue: event.target.checked }));
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction='row' justifyContent='space-between' spacing={2}>
            <Typography variant='h6'>{ttl.label}</Typography>
            <Typography variant='subtitle1'>{ttl.device}</Typography>
          </Stack>
          <Stack direction='row' justifyContent='space-between' spacing={2}>
            <Typography variant='h5'>
              {ttl.value === true ? 'ON' : ttl.value === false ? 'OFF' : '–'}
            </Typography>
            <FormControl>
              <FormLabel>
                <Typography variant='caption'>Override</Typography>
              </FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={ttl.isOverride ?? false}
                      disabled={!isOverrideEnabled}
                      onChange={handleIsOverrideChange}
                    />}
                  label='Enable'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={ttl.overrideValue ?? false}
                      disabled={!overrideValueEnabled}
                      onChange={handleOverrideValueChange}
                    />
                  }
                  label='Value'
                />
              </FormGroup>
            </FormControl>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
