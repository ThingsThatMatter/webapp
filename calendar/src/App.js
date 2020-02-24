import React from 'react';
import {ViewState} from '@devexpress/dx-react-scheduler'
import { Scheduler, DayView, WeekView, Appointments, Toolbar, TodayButton, DateNavigator, ViewSwitcher, AppointmentTooltip, AppointmentForm } from '@devexpress/dx-react-scheduler-material-ui';

const App = () => (
  <Scheduler
    data={[
      { startDate: '2020-02-22 10:00', endDate: '2020-02-22 11:00', title: 'Meeting' },
      { startDate: '2020-02-22 18:00', endDate: '2020-02-22 19:30', title: 'Go to a gym' }
    ]}
  >
    <ViewState
      defaultCurrentDate={Date.now()}
      defaultCurrentViewName="Week"
    />
    <DayView
      startDayHour={8}
      endDayHour={19}
    />
    <WeekView
      startDayHour={8}
      endDayHour={19}
      excludedDays= {[0]}
      cellDuration = {30}
    />
    <Toolbar />
    <DateNavigator />
    <TodayButton />
    <ViewSwitcher />
    <Appointments />
    <AppointmentTooltip
      showCloseButton
      showOpenButton
      showDeleteButton
    />
    <AppointmentForm

    />
  </Scheduler>
);

export default App;
