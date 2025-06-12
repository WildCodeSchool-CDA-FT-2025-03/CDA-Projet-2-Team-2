export const getPathFromRole = (role: string) => {
  if (role === 'admin') {
    return '/admin/users';
  } else if (role === 'secretary') {
    return '/secretary';
  } else if (role === 'agent') {
    return '/agent';
  } else if (role === 'doctor') {
    return '/doctor';
  }
  return '/';
};
