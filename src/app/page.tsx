import { getDinners } from '@/lib/dinners';
import { getWeek } from '@/lib/week';
import DinnerBoard from '@/components/DinnerBoard';
import WeekPlanner from '@/components/WeekPlanner';

export default function Home() {
  const dinners = getDinners();
  const week = getWeek();
  return (
    <>
      <DinnerBoard initialDinners={dinners} />
      <WeekPlanner initialWeek={week} dinners={dinners} />
    </>
  );
}
