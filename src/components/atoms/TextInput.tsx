import { Input } from 'antd';

export interface TextInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  type:
    | 'button'
    | 'checkbox'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'radio'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'text';
}

export const FHTextInput = ({
  value,
  onChange = () => null,
  onBlur = () => null,
  placeholder = '',
  type,
  ...props
}: TextInputProps) => {
  return (
    <Input
      type={type ?? 'text'}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      {...props}
    />
  );
};
