import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import type { AppDispatch } from '../../store';
import { selectTtl, ttlActions } from '../../store/slices/ttl/ttl';
import TtlPanel from './components/TtlPanel/TtlPanel';

export default function TtlControllerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const ttlState = useSelector(selectTtl);

  useEffect(() => {
    const socket = new WebSocket('/ws/ttl/status/modification/');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(ttlActions.updateTtls({ modifications: data }));
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

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
