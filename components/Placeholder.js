export default function Placeholder({ className = '', children }) {
  return <p className={className ? `placeholder ${className}` : 'placeholder'}>{children}</p>;
}
