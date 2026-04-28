import { Link } from 'react-router-dom';
import { cx } from '../../utils/cx';

export default function ButtonLink({
  to,
  variant = 'primary',
  className,
  icon: Icon,
  iconClassName = 'icon icon--md',
  children,
  ...rest
}) {
  const variantClass = variant === 'secondary' ? 'button-secondary' : 'button-primary';
  return (
    <Link to={to} className={cx(variantClass, className)} {...rest}>
      {Icon ? <Icon className={iconClassName} aria-hidden /> : null}
      {children}
    </Link>
  );
}
