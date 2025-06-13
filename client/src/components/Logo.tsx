import doctoplanLogo from '@/assets/doctoplan-logo.svg';

export default function Logo() {
  return (
    <div className="flex items-center">
      <div className="flex items-center justify-center w-16 h-16">
        <img src={doctoplanLogo} alt="logo de DoctoPlan" />
      </div>
      <h1 className="ml-2">DoctoPlan</h1>
    </div>
  );
}
