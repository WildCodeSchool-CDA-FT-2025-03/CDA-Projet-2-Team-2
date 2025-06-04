import SelectForm from '@/components/form/SelectForm';
import { useGetAppointmentTypesQuery } from '@/types/graphql-generated';
import { useAppointmentContext } from '@/hooks/useAppointment';

export default function AppointmentTypesSelect() {
  const { savePatient, HandleAppointment } = useAppointmentContext();
  const { data: dataapp } = useGetAppointmentTypesQuery();

  const optionSelectAppointment =
    dataapp?.getAppointmentTypes?.map(type => ({
      key: type.id.toString(),
      value: type.reason,
    })) || [];
  optionSelectAppointment.unshift({
    key: '',
    value: 'Sélectionner un motif de consultation',
  });

  return (
    <div className="mb-4 max-w-xs">
      <SelectForm
        name="appointmentType"
        value={savePatient.appointmentType || ''}
        title="Type de rendez-vous"
        option={optionSelectAppointment}
        handle={HandleAppointment}
      />
    </div>
  );
}
