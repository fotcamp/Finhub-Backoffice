import { FieldErrors, UseFormRegister } from 'react-hook-form';
import * as S from './LoginPage.style';

export interface FormProps {
  username: string;
  password: string;
}

interface Props {
  onSubmit: () => void;
  register: UseFormRegister<FormProps>;
  errors: FieldErrors<FormProps>;
}

export function LoginPage({ onSubmit, register, errors }: Props) {
  return (
    <S.container>
      <S.cardWrap onSubmit={onSubmit}>
        <S.heading>관리자 계정</S.heading>
        <S.input>
          <label htmlFor="username">Email</label>
          <input
            data-testid="input-email"
            type="email"
            {...register('username', { required: true })}
          />
          {errors.username && <p>이메일 형식에 맞지 않습니다</p>}
        </S.input>
        <S.input>
          <label htmlFor="password">Password</label>
          <input
            data-testid="input-password"
            type="password"
            {...register('password', { required: true })}
          />
          {errors.password && <p>비밀번호 형식에 맞지 않습니다</p>}
        </S.input>
        <S.actions>
          <input type="submit" value="로그인" />
        </S.actions>
      </S.cardWrap>
    </S.container>
  );
}
