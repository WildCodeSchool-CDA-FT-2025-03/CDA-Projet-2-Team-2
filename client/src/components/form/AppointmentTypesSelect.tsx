import SelectForm from '@/components/form/SelectForm';
import { useGetAppointmentTypesQuery } from '@/types/graphql-generated';
import { ChangeEvent } from 'react';

type AppointmentTypesSelectProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export default function AppointmentTypesSelect({ value, onChange }: AppointmentTypesSelectProps) {
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
        value={value}
        title="Type de rendez-vous"
        option={optionSelectAppointment}
        handle={onChange}
      />
    </div>
  );
}
