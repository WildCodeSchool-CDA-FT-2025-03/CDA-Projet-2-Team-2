import DateDisplayInput from '@/components/appointement/DateDisplayInput';
import TimeDisplayInputEnd from '@/components/appointement/TimeDisplayInputEnd';
import TimeSelectStart from '@/components/appointement/TimeSelectStart';
import DoctorSelect from '@/components/form/DoctorSelect';
import AppointmentTypesSelect from '@/components/form/AppointmentTypesSelect';
import DoctorSlots from '@/components/doctor/DoctorSlots';
import { CreateAppointmentContext } from '@/contexts/createappointment.context';
import Calendar from '@/components/calendar/Calendar';

export default function NewAppointementByPatient() {
  return (
    <>
      <CreateAppointmentContext>
        <div className="flex flex-col w-3/4">
          <section className="flex flex-col gap-4 self-start">
            <div className="flex gap-4">
              <img src="/calendar-clock.svg" alt="icone de creation de rendez-vous" />
              <h2>
                Creer un rendez-vous avec Nom du doctor, <span>profession, service</span>
              </h2>
            </div>
            <DoctorSlots />
          </section>
        </div>
        <section className="bg-bgBodyColor sm:w-full md:w-3/4 p-4 sm:p-6 md:p-12 lg:p-24 rounded-sm shadow-md border-borderColor flex flex-col md:flex-row justify-center gap-10 md:gap-45">
          <aside>
            <Calendar />
          </aside>
          <section className="flex flex-col gap-4">
            <DoctorSelect />
            <AppointmentTypesSelect />
            <section className="flex flex-col gap-2">
              {/* Ligne des champs : Jour, Début, Fin */}
              <div className="flex gap-4 items-end whitespace-nowrap">
                <DateDisplayInput />
                <TimeSelectStart />
                <TimeDisplayInputEnd />
              </div>
            </section>
          </section>
        </section>
      </CreateAppointmentContext>
    </>
  );
}
