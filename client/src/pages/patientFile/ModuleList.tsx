const data = [
  {
    doctor: 'Dr Bishop',
    specialty: 'Dermatologie',
    date: '24/04/2025',
    time: '11h05',
  },
  {
    doctor: 'Dr Maboul',
    specialty: 'Dermatologie',
    date: '24/04/2025',
    time: '11h30',
  },
  {
    doctor: 'Dr Who',
    specialty: 'Psychiatrie',
    date: '29/04/2025',
    time: '15h50',
  },
  {
    doctor: 'Dr House',
    specialty: 'Urologie',
    date: '01/07/2025',
    time: '18h30',
  },
];

export default function ModuleList() {
  return (
    <ul className="border-l-4 border-blue rounded-md shadow-sm divide-y divide-gray-100 w-full max-w-md mx-auto bg-white space-y-2">
      {data.map((item, index) => (
        <li
          key={item.date}
          className={`px-4 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-lightBlue'}`}
        >
          <span className="font-bold text-gray-800">{item.doctor}</span>
          <span className="text-gray-600">
            - {item.specialty} - {item.date} - {item.time}
          </span>
        </li>
      ))}
    </ul>
  );
}
