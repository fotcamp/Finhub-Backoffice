import React, { useState } from 'react';
import styled from '@emotion/styled';
import { CreatePageTemplate } from '@finhub/components/templates/Create';
import { FHTextInput } from '@finhub/components/atoms/TextInput';
import { FHButton } from '@finhub/components/atoms/Button';
import { FHFormItem } from '@finhub/components/organisms/FormItem';
import { useNavigate } from 'react-router-dom';
import { announceAPI } from '@finhub/api/announce';
import { FHTextArea } from '@finhub/components/atoms/TextArea';
import { message } from 'antd';

export const AnnounceCreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTextChange =
    (type: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const { value } = e.target;
      if (type === 'title') {
        setTitle(value);
      } else if (type === 'content') {
        setContent(value);
      }
    };

  const handleSubmit = async () => {
    if (!title) {
      message.warning('공지사항 제목을 입력해주세요');
      return;
    }
    if (!content) {
      message.warning('공지사항 내용을 입력해주세요');
      return;
    }

    await announceAPI.create({ title, content });

    message.success('반영되었습니다.');
    navigate(`/services/announces`);
  };

  return (
    <CreatePageTemplate label="공지사항 추가">
      <S.formItemWrapper>
        <FHFormItem direction="vertical" label="공지사항 제목">
          <FHTextInput
            data-testid="input-title"
            type="text"
            value={title}
            onChange={handleTextChange('title')}
          />
        </FHFormItem>
      </S.formItemWrapper>
      <S.formItemWrapper>
        <FHFormItem direction="vertical" label="공지사항 내용">
          <FHTextArea
            data-testid="input-content"
            value={content}
            onChange={handleTextChange('content')}
          />
        </FHFormItem>
      </S.formItemWrapper>
      <S.formItemWrapper>
        <FHButton width="100%" onClick={handleSubmit} type="primary">
          공지사항 추가
        </FHButton>
      </S.formItemWrapper>
    </CreatePageTemplate>
  );
};

const S = {
  formItemWrapper: styled.div`
    max-width: 720px;
    width: 100%;
    padding: 0 16px;
    margin-bottom: 32px;
  `,
};
