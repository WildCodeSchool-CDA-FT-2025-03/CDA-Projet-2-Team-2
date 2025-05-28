
type StatusModalProps = {
  onClose: () => void;
  updateStatus: () => void;
  data: {
    title: string;
    id: string;
  };
};

export default function StatusModal({ data, onClose, updateStatus }: StatusModalProps) {


  return (
    <section className="fixed inset-0 flex bg-bgModalColor backdrop-blur-xs">
      <dialog
        open
        className="fixed top-10 left-1/2 transform -translate-x-1/2 flex items-start justify-center"
      >
        <form method="dialog" className="bg-white p-4 border border-red-600 rounded-md ">
          <h3 className="text-center mb-4">
            {data.title} ?
          </h3>
          <section className="flex justify-center items-center p-2 mt-4">
            <button
              onClick={onClose}
              type="button"
              className="inline-flex items-center mr-2 p-3 rounded-md bg-white border border-red-600 px-4 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              NON
            </button>
            <button
              onClick={updateStatus}
              className="inline-flex items-center p-3 rounded-md bg-[#133F63] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#133F63] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              OUI
            </button>
          </section>
        </form>
      </dialog>
    </section>
  );
}
