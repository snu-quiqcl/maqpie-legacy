import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridRowParams,
  type GridRowsProp,
} from '@mui/x-data-grid';

import type { AppDispatch } from '../../store';
import {
  deleteRun,
  RUN_STATUSES,
  scheduleActions,
  selectSchedule,
  terminateRun,
} from '../../store/slices/schedule/schedule';
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
      valueGetter: (value: string) => value && new Date(value),
    },
    {
      type: 'string',
      field: 'args',
      headerName: 'Args',
      width: 300,
      valueGetter: (value: object) => formatDict(value),
    },
    {
      type: 'actions',
      field: 'actions',
      width: 50,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          label="Terminate"
          showInMenu
          onClick={() => handleTerminateClick(params.row.rid)}
        />,
        <GridActionsCellItem
          label="Delete"
          showInMenu
          onClick={() => handleDeleteClick(params.row.rid)}
        />,
      ],
    },
  ];

  const handleTerminateClick = (rid: number) => {
    dispatch(terminateRun({ rid }));
  };

  const handleDeleteClick = (rid: number) => {
    dispatch(deleteRun({ rid }));
  };

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
