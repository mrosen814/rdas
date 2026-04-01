import { getDinners } from '@/lib/dinners';
import { getWeek } from '@/lib/week';
import DinnerBoard from '@/components/DinnerBoard';
import WeekPlanner from '@/components/WeekPlanner';

export default async function Home() {
  const dinners = await getDinners();
  const week = await getWeek();
  return (
    <>
      <DinnerBoard initialDinners={dinners} />
      <WeekPlanner initialWeek={week} dinners={dinners} />
    </>
  );
}
