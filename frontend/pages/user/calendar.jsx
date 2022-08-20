import Admin from 'layouts/Admin.js';
import dynamic from 'next/dynamic';
const FullCalendar = dynamic(() => import('../../components/Calendar'), {
  ssr: false,
});

export default function Calendar() {
  return <FullCalendar />;
}

Calendar.layout = Admin;
