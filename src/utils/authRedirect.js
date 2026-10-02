export function redirectAfterAuth(navigate, user, intendedPath) {
  if (!user) {
    navigate('/', { replace: true });
    return;
  }

  if (user.role === 'admin') {
    const dest = intendedPath && intendedPath.startsWith('/admin') ? intendedPath : '/admin';
    navigate(dest, { replace: true });
    return;
  }

  const dest =
    intendedPath && intendedPath !== '/login' && intendedPath !== '/register' && !intendedPath.startsWith('/admin')
      ? intendedPath
      : '/';
  navigate(dest, { replace: true });
}
