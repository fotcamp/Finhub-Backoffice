import { Input } from 'antd';
import theme from '../../styles/theme';

const { TextArea } = Input;

export interface TextAreaProps {
  value: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  resize?: boolean;
  height?: string | number;
  readOnly?: boolean;
}

export const FHTextArea = ({
  value,
  onChange = () => {},
  placeholder = '',
  resize = false,
  height = 120,
  readOnly = false,
  ...props
}: TextAreaProps) => {
  return (
    <TextArea
      value={value}
      showCount={!readOnly}
      allowClear={!readOnly}
      readOnly={readOnly}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        height,
        resize: resize ? 'vertical' : 'none',
        opacity: readOnly ? 0.8 : 1,
        background: readOnly ? theme.colors.gray.eaeaea : '#ffffff',
      }}
      {...props}
    />
  );
};
