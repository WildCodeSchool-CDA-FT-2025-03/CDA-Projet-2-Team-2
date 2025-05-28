import { useSearchParams } from 'react-router-dom';

export default function NewAppointementByDoctor() {
  const [params] = useSearchParams();
  return <div>{`NewAppointementByDoctor ${params.get('doctor')}`}</div>;
}
