import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../../store';
import { scheduleActions } from '../../store/slices/schedule/schedule';

export default function SchedulerPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const socket = new WebSocket('/ws/schedule/');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(scheduleActions.updateRuns({ rawRuns: data }));
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  return <div>SchedulerPage</div>;
}
