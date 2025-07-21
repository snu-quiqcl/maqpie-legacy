import type { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';

import type { AppDispatch } from '../../store';
import { RUN_STATUSES, scheduleActions, selectSchedule } from '../../store/slices/schedule/schedule';
import { formatDict } from '../../utils/utils';

export default function SchedulerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const scheduleState = useSelector(selectSchedule);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const columns: GridColDef[] = [
    {
      type: 'number',
      field: 'rid',
      headerName: 'RID',
      width: 100,
    },
    {
      type: 'string',
      field: 'cls',
      headerName: 'Class',
      width: 150,
    },
    {
      type: 'singleSelect',
      field: 'status',
      headerName: 'Status',
      width: 100,
      valueOptions: [...RUN_STATUSES],
    },
    {
      type: 'string',
      field: 'pipeline',
      headerName: 'Pipeline',
      width: 100,
    },
    {
      type: 'number',
      field: 'priority',
      headerName: 'Priority',
      width: 100,
    },
    {
      type: 'dateTime',
      field: 'due_date',
      headerName: 'Due Date',
      width: 200,
      valueGetter: (value: DateTime) => value?.toJSDate(),
    },
    {
      type: 'string',
      field: 'args',
      headerName: 'Args',
      width: 300,
      valueGetter: (value: object) => formatDict(value),
    },
  ];

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

  useEffect(() => {
    setRows(scheduleState.runs.map((run, index) => ({
      id: index,
      ...run,
    })));
  }, [scheduleState.runs]);

  return (
    <Stack>
      <DataGrid
        rows={rows}
        columns={columns}
      />
    </Stack>
  );
}
