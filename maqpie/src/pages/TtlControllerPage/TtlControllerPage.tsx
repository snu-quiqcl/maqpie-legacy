import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { selectTtl } from '../../store/slices/ttl/ttl';
import TtlPanel from './components/TtlPanel/TtlPanel';

export default function TtlControllerPage() {
  const ttlState = useSelector(selectTtl);

  return (
    <Stack>
      <Grid container spacing={2}>
        {ttlState.ttls.map((ttl) => (
          <Grid
            key={ttl.label}
            size={4}
          >
            <TtlPanel ttl={ttl} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
