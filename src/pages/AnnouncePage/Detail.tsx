import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { CreatePageTemplate } from '@finhub/components/templates/Create';
import { FHFormItem } from '@finhub/components/organisms/FormItem';
import { FHTextInput } from '@finhub/components/atoms/TextInput';
import { FHButton } from '@finhub/components/atoms/Button';
import { message } from 'antd';
import { useConfirmNavigate } from '@finhub/hooks/useConfirmNavigate';
import { useNavigate } from 'react-router-dom';
import { announceAPI } from '@finhub/api/announce';
import { FHTextArea } from '@finhub/components/atoms/TextArea';

export const AnnounceDetailPage = () => {
  const { id } = useParams();
  const announceId = Number(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { onConfirm } = useConfirmNavigate(`/services/announces`);
  const navigate = useNavigate();

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

  const initRequest = async () => {
    const showData = await announceAPI.show({ id: announceId });

    if (showData) {
      setTitle(showData.title ?? '');
      setContent(showData.content ?? '');
    }
  };

  const handleSubmit = () => {
    if (!title) {
      message.warning('공지사항 제목을 입력해주세요');
      return;
    }
    if (!content) {
      message.warning('공지사항 내용을 입력해주세요');
      return;
    }

    announceAPI.update({
      id: announceId,
      title,
      content,
    });

    message.success('반영되었습니다.');
    onConfirm('공지사항 목록으로 이동하시겠습니까?');
  };

  const handleDelete = async () => {
    if (window.confirm('공지사항을 삭제하시겠습니까?')) {
      await announceAPI.remove({ id: announceId });
      message.success('반영되었습니다.');
      navigate(`/services/announces`);
    }
  };

  useEffect(() => {
    initRequest();
  }, []);

  return (
    <CreatePageTemplate label="공지사항 수정">
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
      <S.buttonWrapper>
        <FHButton width="100%" onClick={handleDelete} type="default">
          공지사항 삭제
        </FHButton>
        <FHButton width="100%" onClick={handleSubmit} type="primary">
          공지사항 수정
        </FHButton>
      </S.buttonWrapper>
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
  buttonWrapper: styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
  `,
};
