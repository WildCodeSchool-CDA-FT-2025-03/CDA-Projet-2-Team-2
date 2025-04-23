export default function Logo() {
  return (
    <div className="flex items-center">
      <div className="flex items-center justify-center w-10 h-10 rounded bg-cyan-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-6 h-6 text-teal-600"
          stroke="currentColor"
        >
          <path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="ml-2 text-xl font-medium text-teal-800">DoctoPlan</h1>
    </div>
  );
}
