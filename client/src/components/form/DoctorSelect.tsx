import SelectForm from '@/components/form/SelectForm';
import { useGetDoctorsByDepartementQuery } from '@/types/graphql-generated';
import { ChangeEvent } from 'react';

type DepartmentSelectProps = {
  value: string;
  selectedDepartment: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export default function DoctorSelect({
  value,
  selectedDepartment,
  onChange,
}: DepartmentSelectProps) {
  const { data: datadpt } = useGetDoctorsByDepartementQuery({
    variables: { label: parseInt(selectedDepartment) },
  });

  const optionSelectDoctor =
    datadpt?.getDoctorsByDepartement?.map(doctor => ({
      key: doctor.id.toString(),
      value: `${doctor.firstname} ${doctor.lastname} ${doctor.email}`,
    })) || [];
  optionSelectDoctor.unshift({
    key: '',
    value: 'Sélectionner un médecin',
  });

  return (
    <div className="mb-4 max-w-xs">
      <SelectForm
        name="department"
        value={value}
        title="Service"
        option={optionSelectDoctor}
        handle={onChange}
      />
    </div>
  );
}
