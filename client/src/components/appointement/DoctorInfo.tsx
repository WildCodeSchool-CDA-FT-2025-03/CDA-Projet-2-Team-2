import { Doctor } from '@/types/doctor.type';

export default function DoctorInfo({ doctor }: { doctor: Doctor }) {
  return (
    <div className="flex gap-4 items-center">
      <img src="/calendar-clock.svg" alt="icone de creation de rendez-vous" />
      <h2>
        Créer un rendez-vous avec {doctor.firstname} {doctor.lastname},{' '}
        <span>{doctor.departement?.label}</span>
      </h2>
    </div>
  );
}
