import { cx } from '../../utils/cx';

export default function Button({
  variant = 'primary',
  type = 'button',
  className,
  icon: Icon,
  iconClassName = 'icon icon--md',
  children,
  ...rest
}) {
  const variantClass = variant === 'secondary' ? 'button-secondary' : 'button-primary';
  return (
    <button type={type} className={cx(variantClass, className)} {...rest}>
      {Icon ? <Icon className={iconClassName} aria-hidden /> : null}
      {children}
    </button>
  );
}
