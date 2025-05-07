import {
  useChangeDepartmentStatusMutation,
  useGetDepartementsQuery,
} from '@/types/graphql-generated';

type DepartmentStatusModalProps = {
  onClose: () => void;
  department: {
    id: string;
    label: string;
    building: string;
    wing: string;
    level: string;
  };
};

export default function DepartmentStatusModal({ department, onClose }: DepartmentStatusModalProps) {
  const [updateStatus] = useChangeDepartmentStatusMutation();
  const { refetch } = useGetDepartementsQuery();

  const updateDepartmentStatus = async () => {
    await updateStatus({ variables: { changeDepartmentStatusId: department.id } });
    refetch();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="bg-white p-4  border border-red-600 rounded-md">
        <h3 className="text-center mb-4">
          Etes-vous sur de vouloir changer le status de ce service : {department.label} ?
        </h3>
        <div className="flex justify-center items-center p-2 mt-4">
          <button
            onClick={onClose}
            type="button"
            className="inline-flex items-center mr-2 p-3 rounded-md bg-white border border-red-600 px-4 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            NON
          </button>
          <button
            onClick={updateDepartmentStatus}
            className="inline-flex items-center p-3 rounded-md bg-[#133F63] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#133F63] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            OUI
          </button>
        </div>
      </div>
    </div>
  );
}
