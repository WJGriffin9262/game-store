/** Join truthy class name fragments for conditional classes. */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
