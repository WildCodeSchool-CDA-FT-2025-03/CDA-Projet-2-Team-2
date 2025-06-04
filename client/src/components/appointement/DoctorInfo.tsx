import { Doctor } from '@/types/doctor.type';

export default function DoctorInfo({ doctor }: { doctor: Doctor }) {
  return (
    <div className="flex flex-col w-3/4 mt-4 mb-4">
      <div className="flex gap-4 items-center">
        <img src="/calendar-clock.svg" alt="icone de creation de rendez-vous" />
        <h2>
          Créer un rendez-vous avec{' '}
          <span className="text-accent">
            {doctor.firstname} {doctor.lastname}, {doctor.departement?.label}
          </span>
        </h2>
      </div>
    </div>
  );
}
