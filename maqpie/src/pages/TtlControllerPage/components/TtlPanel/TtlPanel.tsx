import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

import type { Ttl } from '../../../../store/slices/ttl/ttl';

type TtlPanelProps = {
  ttl: Ttl;
};

export default function TtlPanel({ ttl }: TtlPanelProps) {
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
                      disabled={ttl.isOverride === null}
                    />}
                  label='Enable'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={ttl.overrideValue ?? false}
                      disabled={ttl.overrideValue === null}
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
